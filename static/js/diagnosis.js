// Diagnosis Section - Handles both Upload Form and Report Display
let currentAnalysisResult = null;
let analysisHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const checkDiagnosis = setInterval(() => {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            clearInterval(checkDiagnosis);
            initDiagnosisFeatures();
            loadHistory();
        }
    }, 100);
});

function initDiagnosisFeatures() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const analysisProgress = document.getElementById('analysisProgress');
    const clearResultBtn = document.getElementById('clearResultBtn');
    
    // Upload area click
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            if (fileInput) fileInput.click();
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#0fb8b0';
            uploadArea.style.transform = 'scale(1.02)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1a4b8c';
            uploadArea.style.transform = 'scale(1)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#1a4b8c';
            uploadArea.style.transform = 'scale(1)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                processImage(file);
            } else {
                showNotification('Please drop a valid image file.', 'error');
            }
        });
    }
    
    // Clear results button
    if (clearResultBtn) {
        clearResultBtn.addEventListener('click', () => {
            clearResults();
        });
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) processImage(file);
    }
    
    function processImage(file) {
        if (file.size > 50 * 1024 * 1024) {
            showNotification('File size exceeds 50MB.', 'error');
            return;
        }
        
        if (!file.type.match('image.*')) {
            showNotification('Please upload an image file.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        if (uploadArea && analysisProgress) {
            uploadArea.style.display = 'none';
            analysisProgress.style.display = 'block';
        }
        
        let progress = 0;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text span');
        
        const progressInterval = setInterval(() => {
            progress += 2;
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    if (analysisProgress) {
                        analysisProgress.style.display = 'none';
                    }
                }, 500);
            }
        }, 20);
        
        reader.onload = function(e) {
            const imagePreview = e.target.result;
            setTimeout(() => simulateAnalysis(imagePreview), 2000);
        };
        reader.readAsDataURL(file);
    }
    
    function simulateAnalysis(imagePreview) {
        const results = [
            { detection: 'No Ulcer Detected', confidence: '98.2%', confidenceValue: 98.2, color: '#27ae60', recommendation: 'No signs of ulceration detected. Regular monitoring recommended.' },
            { detection: 'Possible Ulcer Detected', confidence: '94.7%', confidenceValue: 94.7, color: '#f39c12', recommendation: 'Early signs detected. Follow up with specialist within 1-2 weeks.' },
            { detection: 'Ulcer Detected - Stage 1', confidence: '96.3%', confidenceValue: 96.3, color: '#e74c3c', recommendation: 'Stage 1 ulcer detected. Immediate consultation recommended.' },
            { detection: 'Ulcer Detected - Stage 2', confidence: '99.1%', confidenceValue: 99.1, color: '#c0392b', recommendation: 'Stage 2 ulcer detected. Urgent medical attention required.' }
        ];
        
        const randomIndex = Math.floor(Math.random() * results.length);
        const result = results[randomIndex];
        
        currentAnalysisResult = {
            ...result,
            imagePreview: imagePreview,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        // Save to history
        analysisHistory.unshift(currentAnalysisResult);
        if (analysisHistory.length > 5) analysisHistory.pop();
        localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory));
        
        // Display result
        displayResult(currentAnalysisResult);
        updateHistoryDisplay();
        
        // Reset upload area
        if (uploadArea && fileInput && analysisProgress) {
            uploadArea.style.display = 'block';
            analysisProgress.style.display = 'none';
            fileInput.value = '';
        }
        
        showNotification('Analysis complete!', 'success');
    }
}

function displayResult(result) {
    const resultArea = document.getElementById('resultArea');
    const emptyState = document.getElementById('emptyState');
    const previewImg = document.getElementById('previewImg');
    const detectionResult = document.getElementById('detectionResult');
    const confidenceResult = document.getElementById('confidenceResult');
    const recommendationText = document.getElementById('recommendationText');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const confidenceFill = document.querySelector('.confidence-fill');
    
    if (resultArea && emptyState) {
        resultArea.style.display = 'block';
        emptyState.style.display = 'none';
        
        if (previewImg && result.imagePreview) {
            previewImg.src = result.imagePreview;
        }
        
        if (detectionResult) {
            detectionResult.textContent = result.detection;
            detectionResult.style.color = result.color;
        }
        
        if (confidenceResult) {
            confidenceResult.textContent = result.confidence;
        }
        
        if (recommendationText) {
            recommendationText.textContent = result.recommendation;
        }
        
        if (confidenceFill && result.confidenceValue) {
            confidenceFill.style.width = result.confidenceValue + '%';
            confidenceFill.style.backgroundColor = result.color;
        }
        
        if (downloadReportBtn) {
            downloadReportBtn.disabled = false;
            downloadReportBtn.onclick = () => downloadReport(result);
        }
    }
}

function clearResults() {
    const resultArea = document.getElementById('resultArea');
    const emptyState = document.getElementById('emptyState');
    const previewImg = document.getElementById('previewImg');
    const detectionResult = document.getElementById('detectionResult');
    const confidenceResult = document.getElementById('confidenceResult');
    const recommendationText = document.getElementById('recommendationText');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const confidenceFill = document.querySelector('.confidence-fill');
    
    if (resultArea && emptyState) {
        resultArea.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (previewImg) previewImg.src = '#';
        if (detectionResult) detectionResult.textContent = '--';
        if (confidenceResult) confidenceResult.textContent = '--';
        if (recommendationText) recommendationText.textContent = 'Upload an image to start analysis.';
        if (confidenceFill) confidenceFill.style.width = '0%';
        if (downloadReportBtn) downloadReportBtn.disabled = true;
        
        currentAnalysisResult = null;
    }
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
    
    let html = '';
    analysisHistory.forEach((item, index) => {
        html += `
            <div class="history-item" onclick="loadHistoryResult(${index})">
                <div class="history-date">
                    <i class="far fa-calendar-alt"></i> ${item.date}
                </div>
                <div class="history-detection" style="color: ${item.color}">
                    ${item.detection}
                </div>
                <div class="history-confidence">
                    Confidence: ${item.confidence}
                </div>
            </div>
        `;
    });
    historyList.innerHTML = html;
}

function loadHistoryResult(index) {
    const result = analysisHistory[index];
    if (result) {
        displayResult(result);
        showNotification('Loaded previous analysis result', 'info');
    }
}

function downloadReport(result) {
    const reportContent = `
╔══════════════════════════════════════════════════════════════╗
║              AI ULCER DETECTION REPORT                       ║
║                   UlcerDetect AI System                      ║
╚══════════════════════════════════════════════════════════════╝

📋 REPORT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${result.date}
Time: ${result.time}
Report ID: ${Date.now()}

🔬 DETECTION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detection: ${result.detection}
Confidence Score: ${result.confidence}

📊 CONFIDENCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Confidence Level: ${result.confidenceValue}%

💊 RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${result.recommendation}

⚠️ DISCLAIMER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated AI analysis. Please consult with a qualified 
healthcare professional for proper medical diagnosis and treatment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UlcerDetect AI - Revolutionizing Wound Care
© 2024 All Rights Reserved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UlcerDetect-Report-${result.date.replace(/\//g, '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully!', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}