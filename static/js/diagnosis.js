// Diagnosis Section - Requires Login
let currentAnalysisResult = null;
let analysisHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const checkDiagnosis = setInterval(() => {
        const diagnosisSection = document.getElementById('diagnosis');
        if (diagnosisSection) {
            clearInterval(checkDiagnosis);
            checkLoginStatus();
            initDiagnosisFeatures();
        }
    }, 100);
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const diagnosisContainer = document.querySelector('.diagnosis-container');
    let loginRequiredDiv = document.getElementById('loginRequiredMessage');
    
    if (!isLoggedIn) {
        if (diagnosisContainer) {
            diagnosisContainer.style.display = 'none';
        }
        
        if (!loginRequiredDiv) {
            const section = document.getElementById('diagnosis');
            const container = section.querySelector('.container');
            
            const messageDiv = document.createElement('div');
            messageDiv.id = 'loginRequiredMessage';
            messageDiv.className = 'login-required-message';
            messageDiv.innerHTML = `
                <div class="lock-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>Login Required</h3>
                <p>Please login or sign up to access the AI Diagnosis feature.</p>
                <div class="login-required-buttons">
                    <button class="btn btn-primary" id="loginRequiredBtn">
                        <i class="fas fa-sign-in-alt"></i> Login Now
                    </button>
                    <button class="btn btn-outline" id="signupRequiredBtn">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </div>
                <div class="feature-preview">
                    <h4>What you'll get:</h4>
                    <ul>
                        <li><i class="fas fa-chart-line"></i> AI-powered ulcer detection</li>
                        <li><i class="fas fa-history"></i> Save analysis history</li>
                        <li><i class="fas fa-download"></i> Download detailed reports</li>
                        <li><i class="fas fa-lock"></i> Secure & private analysis</li>
                    </ul>
                </div>
            `;
            container.appendChild(messageDiv);
            
            document.getElementById('loginRequiredBtn')?.addEventListener('click', () => {
                document.getElementById('authModal').style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
            
            document.getElementById('signupRequiredBtn')?.addEventListener('click', () => {
                const modal = document.getElementById('authModal');
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                document.getElementById('signupTab').click();
            });
        }
    } else {
        if (diagnosisContainer) {
            diagnosisContainer.style.display = 'grid';
        }
        if (loginRequiredDiv) {
            loginRequiredDiv.style.display = 'none';
        }
        loadHistory();
    }
}

function initDiagnosisFeatures() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput?.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#0fb8b0';
        });
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1a4b8c';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1a4b8c';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) processImage(file);
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) processImage(e.target.files[0]);
        });
    }
    
    document.getElementById('clearResultBtn')?.addEventListener('click', clearResults);
    
    function processImage(file) {
        const reader = new FileReader();
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('analysisProgress').style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            document.querySelector('.progress-fill').style.width = progress + '%';
            document.querySelector('.progress-text span').textContent = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    document.getElementById('analysisProgress').style.display = 'none';
                }, 500);
            }
        }, 20);
        
        reader.onload = (e) => {
            setTimeout(() => simulateAnalysis(e.target.result), 2000);
        };
        reader.readAsDataURL(file);
    }
    
    function simulateAnalysis(imagePreview) {
        const results = [
            { detection: 'No Ulcer Detected', confidence: '98.2%', confidenceValue: 98.2, color: '#27ae60', recommendation: 'No signs of ulceration detected.' },
            { detection: 'Possible Ulcer Detected', confidence: '94.7%', confidenceValue: 94.7, color: '#f39c12', recommendation: 'Early signs detected. Follow up with specialist.' },
            { detection: 'Ulcer Detected - Stage 1', confidence: '96.3%', confidenceValue: 96.3, color: '#e74c3c', recommendation: 'Stage 1 ulcer detected. Consultation recommended.' },
            { detection: 'Ulcer Detected - Stage 2', confidence: '99.1%', confidenceValue: 99.1, color: '#c0392b', recommendation: 'Stage 2 ulcer detected. Urgent medical attention required.' }
        ];
        const result = results[Math.floor(Math.random() * results.length)];
        
        currentAnalysisResult = {
            ...result,
            imagePreview: imagePreview,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        analysisHistory.unshift(currentAnalysisResult);
        if (analysisHistory.length > 5) analysisHistory.pop();
        localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory));
        
        displayResult(currentAnalysisResult);
        updateHistoryDisplay();
        
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('fileInput').value = '';
        showNotification('Analysis complete!', 'success');
    }
}

function displayResult(result) {
    document.getElementById('resultArea').style.display = 'block';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('previewImg').src = result.imagePreview;
    document.getElementById('detectionResult').textContent = result.detection;
    document.getElementById('confidenceResult').textContent = result.confidence;
    document.getElementById('recommendationText').textContent = result.recommendation;
    document.querySelector('.confidence-fill').style.width = result.confidenceValue + '%';
    
    const downloadBtn = document.getElementById('downloadReportBtn');
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => downloadReport(result);
}

function clearResults() {
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
    currentAnalysisResult = null;
}

function loadHistory() {
    const saved = localStorage.getItem('analysisHistory');
    if (saved) {
        analysisHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No previous analyses found.</p>';
        return;
    }
    historyList.innerHTML = analysisHistory.map((item, index) => `
        <div class="history-item" onclick="loadHistoryResult(${index})">
            <div class="history-date"><i class="far fa-calendar-alt"></i> ${item.date}</div>
            <div class="history-detection" style="color: ${item.color}">${item.detection}</div>
            <div class="history-confidence">Confidence: ${item.confidence}</div>
        </div>
    `).join('');
}

function loadHistoryResult(index) {
    if (analysisHistory[index]) displayResult(analysisHistory[index]);
}

function downloadReport(result) {
    const report = `AI ULCER DETECTION REPORT\n========================\nDate: ${result.date}\nTime: ${result.time}\n\nDetection: ${result.detection}\nConfidence: ${result.confidence}\n\nRecommendation: ${result.recommendation}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UlcerDetect-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Report downloaded!', 'success');
}

function showNotification(message, type) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}