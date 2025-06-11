// PDF to Audio Converter Application - CORRECTED VERSION

class PDFToAudioConverter {
    constructor() {
        this.pdfDoc = null;
        this.pdfText = '';
        this.audioBlob = null;
        this.totalPages = 0;
        this.currentUtterance = null;
        this.isConverting = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupSpeechSynthesis();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileStats = document.getElementById('fileStats');
        this.removeFileBtn = document.getElementById('removeFile');
        
        // Settings elements
        this.settingsSection = document.getElementById('settingsSection');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.startPage = document.getElementById('startPage');
        this.endPage = document.getElementById('endPage');
        
        // Convert elements
        this.convertSection = document.getElementById('convertSection');
        this.convertBtn = document.getElementById('convertBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.statusMessage = document.getElementById('statusMessage');
        
        // Download elements
        this.downloadSection = document.getElementById('downloadSection');
        this.downloadTitle = document.getElementById('downloadTitle');
        this.downloadSize = document.getElementById('downloadSize');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Audio control elements
        this.audioSection = document.getElementById('audioSection');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
    }

    setupEventListeners() {
        // Upload area events
        this.uploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            this.fileInput.click();
        });

        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.uploadArea.contains(e.relatedTarget)) {
                this.uploadArea.classList.remove('dragover');
            }
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });

        this.fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });

        this.removeFileBtn.addEventListener('click', this.removeFile.bind(this));
        
        // Settings events
        this.speedSlider.addEventListener('input', this.updateSpeedValue.bind(this));
        this.startPage.addEventListener('input', this.validatePageRange.bind(this));
        this.endPage.addEventListener('input', this.validatePageRange.bind(this));
        
        // Convert and download events
        this.convertBtn.addEventListener('click', this.startConversion.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadText.bind(this));
        this.resetBtn.addEventListener('click', this.resetApplication.bind(this));
        
        // Audio control events
        this.playBtn.addEventListener('click', this.playAudio.bind(this));
        this.pauseBtn.addEventListener('click', this.pauseAudio.bind(this));
        this.stopBtn.addEventListener('click', this.stopAudio.bind(this));
    }

    setupSpeechSynthesis() {
        this.synthesis = window.speechSynthesis;
        this.availableVoices = [];
        
        // Load voices
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
        }
    }

    loadVoices() {
        this.availableVoices = this.synthesis.getVoices();
        this.populateVoiceSelect();
    }

    populateVoiceSelect() {
        const femaleVoices = this.availableVoices.filter(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('susan') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.gender === 'female'
        );
        
        const maleVoices = this.availableVoices.filter(voice =>
            voice.name.toLowerCase().includes('male') ||
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('mark') ||
            voice.name.toLowerCase().includes('alex') ||
            voice.gender === 'male'
        );

        // Use default voices if specific gender voices not found
        if (femaleVoices.length === 0 && this.availableVoices.length > 0) {
            femaleVoices.push(this.availableVoices[0]);
        }

        if (maleVoices.length === 0 && this.availableVoices.length > 1) {
            maleVoices.push(this.availableVoices[1]);
        }

        this.femaleVoice = femaleVoices[0];
        this.maleVoice = maleVoices[0] || femaleVoices[0];
    }

    async processFile(file) {
        // Validate file
        if (!this.validateFile(file)) return;
        
        this.showStatus('Loading PDF...', 'info');
        
        try {
            // Load PDF
            const arrayBuffer = await file.arrayBuffer();
            this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            this.totalPages = this.pdfDoc.numPages;
            
            // Update UI
            this.fileName.textContent = file.name;
            this.fileStats.textContent = `${this.totalPages} pages • ${this.formatFileSize(file.size)}`;
            this.fileInfo.style.display = 'flex';
            this.settingsSection.style.display = 'block';
            this.convertSection.style.display = 'block';
            
            // Update page range inputs
            this.startPage.max = this.totalPages;
            this.endPage.max = this.totalPages;
            this.endPage.value = this.totalPages;
            
            this.showStatus('PDF loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showStatus('Error loading PDF. Please try a different file.', 'error');
        }
    }

    validateFile(file) {
        if (file.type !== 'application/pdf') {
            this.showStatus('Please select a PDF file.', 'error');
            return false;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB
            this.showStatus('File size exceeds 50MB limit.', 'error');
            return false;
        }

        return true;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile() {
        this.pdfDoc = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.settingsSection.style.display = 'none';
        this.convertSection.style.display = 'none';
        this.downloadSection.style.display = 'none';
        this.audioSection.style.display = 'none';
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
    }

    updateSpeedValue() {
        this.speedValue.textContent = this.speedSlider.value;
    }

    validatePageRange() {
        const start = parseInt(this.startPage.value);
        const end = parseInt(this.endPage.value);
        
        if (start > end) {
            this.startPage.value = end;
        }
        
        if (end < start) {
            this.endPage.value = start;
        }
    }

    async startConversion() {
        if (!this.pdfDoc) return;
        
        this.isConverting = true;
        this.convertBtn.disabled = true;
        this.convertBtn.innerHTML = 'Converting...';
        this.progressContainer.style.display = 'block';
        this.updateProgress(0, 'Extracting text from PDF...');
        
        try {
            // Extract text from selected pages
            await this.extractTextFromPages();
            
            if (!this.pdfText.trim()) {
                throw new Error('No text found in the selected pages.');
            }

            this.updateProgress(100, 'Text extraction complete!');
            this.showConversionComplete();
            
        } catch (error) {
            console.error('Conversion error:', error);
            this.showStatus(`Conversion failed: ${error.message}`, 'error');
            this.resetConvertButton();
        }
    }

    async extractTextFromPages() {
        const startPage = parseInt(this.startPage.value);
        const endPage = parseInt(this.endPage.value);
        this.pdfText = '';
        
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            this.pdfText += pageText + ' ';
            
            const progress = (pageNum - startPage + 1) / (endPage - startPage + 1) * 100;
            this.updateProgress(progress, `Extracting text from page ${pageNum}...`);
        }
    }

    showConversionComplete() {
        this.convertSection.style.display = 'none';
        this.downloadSection.style.display = 'block';
        this.audioSection.style.display = 'block';
        
        const textSize = new Blob([this.pdfText], { type: 'text/plain' }).size;
        this.downloadSize.textContent = `Text size: ${this.formatFileSize(textSize)}`;
        
        this.showStatus('Text extraction complete! You can now play the audio or download the text.', 'success');
    }

    playAudio() {
        if (!this.pdfText.trim()) return;
        
        // Stop any current speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(this.pdfText);
        
        // Configure voice
        const selectedVoice = this.voiceSelect.value === 'female' ? this.femaleVoice : this.maleVoice;
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        // Configure speech settings
        utterance.rate = parseInt(this.speedSlider.value) / 150; // Normalize to 1.0 = 150 WPM
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            this.playBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
        };
        
        utterance.onend = () => {
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = true;
        };
        
        utterance.onerror = (event) => {
            this.showStatus('Speech synthesis failed: ' + event.error, 'error');
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = true;
        };
        
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }

    pauseAudio() {
        if (this.synthesis.speaking) {
            this.synthesis.pause();
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }
    }

    stopAudio() {
        this.synthesis.cancel();
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;
    }

    downloadText() {
        if (!this.pdfText) return;
        
        const blob = new Blob([this.pdfText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.fileName.textContent.replace('.pdf', '')}_text.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetApplication() {
        // Stop any ongoing speech
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        // Reset all state
        this.pdfDoc = null;
        this.pdfText = '';
        this.isConverting = false;
        
        // Reset UI
        this.removeFile();
        this.resetConvertButton();
        this.progressContainer.style.display = 'none';
        this.updateProgress(0, '');
    }

    resetConvertButton() {
        this.convertBtn.disabled = false;
        this.convertBtn.innerHTML = 'Extract Text & Enable Audio';
        this.isConverting = false;
    }

    updateProgress(percent, text) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = text;
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                if (this.statusMessage.classList.contains(type)) {
                    this.statusMessage.textContent = '';
                    this.statusMessage.className = 'status-message';
                }
            }, 5000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for required APIs
    if (!window.speechSynthesis) {
        alert('Your browser does not support speech synthesis. Please use a modern browser like Chrome, Firefox, or Edge.');
        return;
    }

    // Check if PDF.js is loaded
    if (typeof pdfjsLib === 'undefined') {
        alert('PDF.js library failed to load. Please refresh the page.');
        return;
    }

    // Initialize the converter
    new PDFToAudioConverter();
});
