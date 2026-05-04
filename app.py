# Import basic libraries
import os # For file handling (paths, folders)
import datetime # For date and time operations
import numpy as np # For numerical operations (arrays)
# Import Flask and related modules
from flask import Flask, render_template, redirect, url_for, flash, request, send_from_directory, session
# Import database (SQLite)
from flask_sqlalchemy import SQLAlchemy
# Import login system
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
# Import password hashing
from flask_bcrypt import Bcrypt
# Secure file upload
from werkzeug.utils import secure_filename
# Import TensorFlow (for ML model)
import tensorflow as tf
from tensorflow.keras.preprocessing import image 
# Image processing
from PIL import Image

# Create Flask app
app = Flask(__name__)
# App configuration
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245' # Used for security (sessions)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' # Database file
app.config['UPLOAD_FOLDER'] = 'static/uploads' # Folder to save uploaded images
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database, encryption, login manager
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
# If user not logged in → redirect to login page
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# Global variables for ML model
_model = None # Stores model
MODEL_LOADED = False # Flag if model is loaded
CLASS_NAMES = ['AVM', 'Normal', 'Ulcer'] # Output classes

# Function to load model only once
def get_model():
    global _model, MODEL_LOADED
    # If model not loaded yet
    if _model is None:
        try:
            _model = tf.keras.models.load_model('best_model.keras') # Load model
            MODEL_LOADED = True
            print("Model loaded successfully.")
        except Exception as e:
            MODEL_LOADED = False
            _model = None
            print(f"Error loading model: {e}")
    return _model

# ------------------ DATABASE MODELS ------------------
# User table
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True) # Unique ID
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    # Relationship with image history
    history = db.relationship('ImageHistory', backref='owner', lazy=True)

# Image history table
class ImageHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_file = db.Column(db.String(100), nullable=False) # File name
    prediction = db.Column(db.String(100), nullable=False) # Predicted class
    confidence = db.Column(db.Float, nullable=False) # Prediction confidence
    # Date when image uploaded
    date_uploaded = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    # Foreign key → connects to User table
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Load user for login system
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------------------ MODEL PREDICTION FUNCTION ------------------
def model_predict(img_path):
    model = get_model() # Load model
    # If model not loaded
    if model is None:
        return "Model Not Loaded", 0.0
    # Load image and resize to 256x256
    img = image.load_img(img_path, target_size=(256, 256), interpolation='bilinear')
    # Convert image to array
    img_array = image.img_to_array(img)
    # Add batch dimension → required by model
    img_array = np.expand_dims(img_array, axis=0)
    # Predict
    preds = model.predict(img_array)
    # Get index of highest probability
    class_idx = np.argmax(preds[0])
    # Get confidence
    confidence = float(np.max(preds[0]))
    # Return class name + confidence
    return CLASS_NAMES[class_idx], confidence

# ------------------ ROUTES ------------------
# Home page
@app.route("/")
@app.route("/index")
def index():
    return render_template('index.html')

# Route to serve sections (for dynamic loading in index.html)
@app.route("/sections/<path:filename>")
def sections(filename):
    return render_template(f'sections/{filename}')

# Registration
@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('upload'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Passwords do not match', 'danger')
            return redirect(url_for('index'))
            
        user_exists = User.query.filter_by(email=email).first()
        if user_exists:
            flash('Email already registered', 'danger')
            return redirect(url_for('index'))
            
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('index'))
        
    return redirect(url_for('index'))

# Login
@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('upload'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False
        
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=remember)
            return redirect(url_for('upload'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    
    return redirect(url_for('index'))

# Logout
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('index'))

# Upload/Prediction page
@app.route("/upload", methods=['GET', 'POST'])
@login_required # Must be logged in
def upload():
    if request.method == 'POST':
        # Check file present
        if 'file' not in request.files:
            flash('No file part', 'danger')
            return redirect(request.url)
        
        file = request.files['file']
        # If no file selected
        if file.filename == '':
            flash('No selected file', 'danger')
            return redirect(request.url)
        
        if file:
            # Secure file name
            filename = secure_filename(file.filename)
            # Create unique filename using timestamp
            unique_filename = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
            # Full file path
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            # Save file
            file.save(file_path)
            # Run prediction
            pred_class, confidence = model_predict(file_path)
            # Save prediction in database
            history_item = ImageHistory(
                image_file=unique_filename,
                prediction=pred_class,
                confidence=confidence,
                user_id=current_user.id
            )
            db.session.add(history_item)
            db.session.commit()

            # Show result
            return render_template(
                'predict.html',
                title='Prediction Result',
                image_file=unique_filename,
                prediction=pred_class,
                confidence=confidence
            )
            
    return render_template('predict.html', title='Predict Endoscopy Image')

# History page
@app.route("/history")
@login_required
def history():
    # Get user's past predictions (latest first)
    user_history = ImageHistory.query.filter_by(
        user_id=current_user.id
    ).order_by(ImageHistory.date_uploaded.desc()).all()
    return render_template('history.html', history=user_history)

# Individual Report page
@app.route("/report/<int:report_id>")
@login_required
def report(report_id):
    # Get specific report
    report = ImageHistory.query.get_or_404(report_id)
    # Ensure report belongs to current user
    if report.owner != current_user:
        flash('You do not have permission to view this report.', 'danger')
        return redirect(url_for('history'))
        
    return render_template(
        'predict.html', 
        title='Analysis Report',
        prediction=report.prediction,
        confidence=report.confidence,
        image_file=report.image_file,
        is_report=True # Flag to show specific report UI
    )

# ------------------ RUN APP ------------------
if __name__ == '__main__':
    # Create database and folders before starting
    with app.app_context():
        db.create_all()
        # Create upload folder if not exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Run Flask app in debug mode
    app.run(debug=True)