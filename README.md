# PDF to Audio Converter

A modern web application that converts PDF documents to audio using client-side processing. Built with vanilla JavaScript, PDF.js, and the Web Speech API.

## 🚀 Live Demo

Visit: [https://ganesh-sunkara-7.github.io/my_website/](https://ganesh-sunkara-7.github.io/my_website/)

## ✨ Features

- **📄 PDF Text Extraction**: Extract text from PDF documents using PDF.js
- **🎵 Text-to-Speech**: Convert extracted text to speech using Web Speech API
- **⚙️ Customizable Settings**:
  - Speed control (50-400 words per minute)
  - Male/Female voice selection
  - Page range selection
- **🎨 Modern UI**: Purple and white themed interface
- **🔒 Privacy-Focused**: All processing happens client-side
- **📱 Responsive**: Works on desktop and mobile devices

## 🛠️ Installation & Setup

### For GitHub Pages Deployment

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/ganesh-sunkara-7/my_website.git
   cd my_website
   ```

2. **Update the files in your repository**:
   - Replace `app.js` with the updated version
   - Replace `index.html` with the updated version
   - Keep `style.css` as is (already properly styled)
   - Add this `README.md` file

3. **Upload to GitHub**:
   ```bash
   git add .
   git commit -m "Update PDF to Audio Converter with working functionality"
   git push origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save and wait for deployment

### For Local Development

1. **Simple HTTP Server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Open browser**: Navigate to `http://localhost:8000`

## 📁 File Structure

```
my_website/
├── index.html          # Main HTML structure
├── app.js             # JavaScript functionality
├── style.css          # CSS styling (purple/white theme)
├── enhanced_pdf_to_audio.py  # Python backend (optional)
└── README.md          # This file
```

## 🔧 How It Works

### Client-Side Processing
1. **PDF Upload**: User selects a PDF file
2. **Text Extraction**: PDF.js extracts text from selected pages
3. **Speech Synthesis**: Web Speech API converts text to speech
4. **Audio Playback**: Users can listen directly in browser
5. **Text Download**: Extracted text can be downloaded as .txt file

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## 🚀 Usage Instructions

1. **Upload PDF**: Drag & drop or browse to select a PDF file
2. **Configure Settings**:
   - Adjust speech speed (50-400 WPM)
   - Select voice gender (Male/Female)
   - Set page range to convert
3. **Convert**: Click "Convert & Download"
4. **Listen**: Use "Play Speech" button to hear the audio
5. **Download**: Save extracted text as .txt file

## 🔒 Privacy & Security

- **No Server Processing**: All operations happen in your browser
- **No File Uploads**: PDF files never leave your device
- **Local Storage**: No data is stored remotely
- **HTTPS Only**: Secure connection required for speech synthesis

## 🐛 Known Issues & Solutions

### Issue: 1KB MP3 Files
**Problem**: MP3 files are too small and don't play
**Solution**: The app now uses browser speech synthesis instead of generating MP3 files

### Issue: Speech Not Working
**Possible Causes & Solutions**:
- **HTTPS Required**: GitHub Pages automatically provides HTTPS
- **Browser Support**: Use Chrome, Firefox, or Safari
- **Permissions**: Allow microphone/audio permissions if prompted

### Issue: PDF Not Loading
**Possible Causes & Solutions**:
- **File Size**: Ensure PDF is under 50MB
- **File Type**: Only PDF files are supported
- **Corrupted PDF**: Try a different PDF file
- **Password Protected**: Remove password protection first

## 🔧 Troubleshooting

### Clear Browser Cache
```javascript
// Run in browser console to clear cache
window.location.reload(true);
```

### Check Console Errors
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Report issues with console logs

### Test with Sample PDF
1. Use the built-in demo feature
2. Try with a simple, text-based PDF
3. Avoid image-heavy or scanned PDFs

## 🚀 Advanced Setup (Optional)

### Custom Domain
1. Add CNAME file to repository root
2. Configure DNS settings
3. Update GitHub Pages settings

### Analytics Integration
Add Google Analytics or other tracking:
```html
<!-- Add to index.html <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 🛡️ Security Considerations

- Content Security Policy (CSP) headers recommended
- HTTPS is required for speech synthesis
- Large files may cause browser memory issues
- Consider file size limits for production use

## 📧 Support & Issues

1. **GitHub Issues**: [Create an issue](https://github.com/ganesh-sunkara-7/my_website/issues)
2. **Check Console**: Look for JavaScript errors
3. **Browser Compatibility**: Test in different browsers
4. **File Format**: Ensure PDF is text-based, not scanned

## 🎯 Future Enhancements

- [ ] Multiple language support
- [ ] Voice speed fine-tuning
- [ ] PDF page preview
- [ ] Audio file export (WAV format)
- [ ] Batch processing
- [ ] OCR for scanned PDFs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- **PDF.js**: Mozilla's PDF rendering library
- **Web Speech API**: Browser's built-in speech synthesis
- **Font Awesome**: Icons and UI elements
- **CSS Design**: Custom purple/white theme

---

**Note**: This application works entirely in the browser and doesn't require any server-side processing, making it perfect for GitHub Pages hosting.