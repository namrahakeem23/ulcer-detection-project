# Import basic libraries
import os # For file handling (paths, folders)
import datetime # For date and time operations
import numpy as np # For numerical operations (arrays)
# Import Flask and related modules
from flask import Flask, render_template, redirect, url_for, flash, request,send_from_directory
# Import database (SQLite)
from flask_sqlalchemy import SQLAlchemy
# Import login system
from flask_login import LoginManager, UserMixin, login_user, login_required,logout_user, current_user
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
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245' # Used forsecurity (sessions)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' # Database file
app.config['UPLOAD_FOLDER'] = 'static/uploads' # Folder to save uploadedimages
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
 date_uploaded = db.Column(db.DateTime, nullable=False,
default=datetime.datetime.utcnow)
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
 img =image.load_img(img_path, target_size=(256, 256), interpolation='bilinear')
 # Convert image to array
 img_array = image.img_to_array(img)
 # Add batch dimension → required by model
 img_array = np.expand_dims(img_array, axis=0)
 # NOTE:
 # Model trained on [0,255] values → so no normalization
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
# Register page
@app.route("/register", methods=['GET', 'POST'])
def register():
 # If already logged in → go to predict page
 if current_user.is_authenticated:
     return redirect(url_for('predict'))
 if request.method == 'POST':
 # Get data from form
 # username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
 # Hash password (security)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
 # Create new user
    user = User(username=username, email=email, password=hashed_password)
 # Save to database
 db.session.add(user)
 db.session.commit()
 # Show success message
 flash('Your account has been created! You are now able to log in', 'success')
 return redirect(url_for('login'))
 return render_template('register.html')
# Login page
@app.route("/login", methods=['GET', 'POST'])
def login():
 if current_user.is_authenticated:
    return redirect(url_for('predict'))
 if request.method == 'POST':
    email = request.form.get('email')
    password = request.form.get('password')
 # Find user by email
 user = User.query.filter_by(email=email).first()
 # Check password
 if user and bcrypt.check_password_hash(user.password, password):
 # Login userlogin_user(user, remember=request.form.get('remember'))
 # Redirect to next page if exists
    next_page = request.args.get('next')
    return redirect(next_page) if next_page else redirect(url_for('predict'))
 else:
    flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html')
# Logout
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('index'))
# Prediction page
@app.route("/predict", methods=['GET', 'POST'])
@login_required # Must be logged in
def predict():
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
            unique_filename =f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
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
confidence=f"{confidence*100:.2f}%")
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
# ------------------ RUN APP ------------------
if __name__ == '__main__':
 # Create database and folders before starting
    with app.app_context():
        db.create_all()
 # Create upload folder if not exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
 # Run Flask app in debug mode
        app.run(debug=True)
          
#-------validation code------ 
from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = 'secretkey'  #secret key for session management
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #to suppress a warning from SQLAlchemy
db = SQLAlchemy(app) #initialize the database

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

# Database initialization with app context
with app.app_context(): 
    db.create_all()

@app.route('/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        #validations
        if not name or len(name.strip())<2:
            flash('Name must be at least 2 characters long.', 'error')
            return redirect(url_for('register'))
        
        if not email or '@' not in email:
            flash('Please enter a valid email address.', 'error')
            return redirect(url_for('register'))
        
        #password must be at least 8 characters long and a combination of letters and numbers and special characters
        if len(password)<8 or not any(char.isdigit() for char in password)\
              or not any(char.isalpha() for char in password) or not any(not char.isalnum()\
                                                                          for char in password):
            flash('Password must be at least 8 characters long and contain letters, \
                  numbers, and special characters.', 'error')
            return redirect(url_for('register'))
        
        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('register'))
        
        #check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered. Please log in.', 'error')
            return redirect(url_for('register'))
        
        #create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            name=name.strip(),
            email=email.strip(),
            password=hashed_password
        )
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('An error occurred during registration. Please try again.', 'error')
            return redirect(url_for('register'))
        
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')
    return render_template('login.html')
        

if __name__ == '__main__':
    app.run(debug=True)        