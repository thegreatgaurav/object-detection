# AR Object Visualizer

A browser-based Augmented Reality application that detects real-world objects using AI and overlays 3D labels with names, fun facts, and confidence scores in real-time.

## Features

- 🎥 **Real-time Object Detection** - Uses TensorFlow.js with COCO-SSD (MobileNet-based) model
- 🎨 **3D AR Labels** - Beautiful Three.js overlays with smooth animations
- 🔊 **Voice Feedback** - Text-to-speech announces detected objects and fun facts
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Optimized Performance** - Throttled detection, frame resizing, and efficient rendering
- 🎯 **Multiple Objects** - Detects and tracks multiple objects simultaneously

## Setup Instructions

1. **No Installation Required!** - This is a pure browser-based application.

2. **Open the Application**
   - Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
   - Or use a local server for better performance:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server -p 8000
     
     # Using PHP
     php -S localhost:8000
     ```
   - Then navigate to `http://localhost:8000` in your browser

3. **Grant Camera Permissions**
   - When prompted, allow the browser to access your camera
   - On mobile devices, make sure to grant camera permissions

4. **Wait for Model Loading**
   - The AI model will download and load automatically (first time may take a few seconds)
   - You'll see a loading spinner while the model initializes

5. **Start Using**
   - Point your camera at objects
   - Labels will appear automatically when objects are detected
   - Toggle voice feedback on/off using the button in the bottom-right corner

## Technical Details

### Tech Stack
- **HTML5** - Structure
- **CSS3** - Futuristic black/neon styling
- **JavaScript (ES6+)** - Application logic
- **Three.js** - 3D graphics and AR rendering
- **TensorFlow.js** - Machine learning inference
- **COCO-SSD Model** - Object detection (MobileNet-based)
- **Web Speech API** - Text-to-speech

### Architecture
- **`index.html`** - Main HTML structure
- **`style.css`** - Styling and UI design
- **`script.js`** - Core application logic including:
  - Camera initialization
  - Object detection loop
  - 3D label creation and animation
  - Speech synthesis
  - UI controls

### Performance Optimizations
- Detection throttling (300ms intervals)
- Frame resizing for faster processing (50% scale)
- Efficient Three.js rendering
- Label pooling and reuse
- Async model loading

### Supported Objects
The app can detect 80+ object categories from the COCO dataset, including:
- People, animals, vehicles
- Furniture, electronics, food
- Sports equipment, personal items
- And many more!

Each object has associated fun facts and information stored in the application.

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS 11+, macOS 10.13+)
- ✅ Opera

**Note**: Requires:
- Modern browser with WebGL support
- Camera access permissions
- Web Speech API support (for voice features)

## Troubleshooting

### Camera not working
- Make sure you've granted camera permissions
- Check if another application is using the camera
- Try refreshing the page

### Model not loading
- Check your internet connection (model downloads on first use)
- Try clearing browser cache
- Ensure you're using a modern browser

### Voice not working
- Check if your browser supports Web Speech API
- Make sure voice is enabled (toggle button)
- Some browsers require HTTPS for speech synthesis (use a local server)

### Performance issues
- Close other browser tabs
- Reduce browser zoom level
- Ensure adequate lighting for better detection

## Development

To modify the application:

1. Edit `script.js` to change detection logic, labels, or behavior
2. Edit `style.css` to modify the appearance
3. Edit `OBJECT_DATABASE` in `script.js` to add/modify object information
4. Adjust `DETECTION_THROTTLE` in `script.js` to change detection frequency

## License

This is a demonstration application. Feel free to use and modify as needed.

