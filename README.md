# Neon AR Object Explorer

A futuristic, browser-based augmented reality experience that detects real-world objects with TensorFlow.js and overlays glowing 3D fact cards directly in your camera view. Everything runs client-side with Three.js, AR.js, and the Web Speech API—no installs or backend required.

## Highlights

- 🎥 **Immersive AR Pipeline** – AR.js powers the live camera feed while Three.js projects floating text planes in real time.
- 🧠 **On-Device AI** – Uses the lightweight COCO-SSD (MobileNet) model through TensorFlow.js for fast multi-object detection.
- 🪐 **Dynamic 3D Labels** – Each detection spawns a neon sprite with name, confidence, and a fun fact, including smooth ease-in/out transitions.
- 🔊 **Talkative Guide** – Optional text-to-speech narration announces what was spotted and why it’s interesting.
- 🚀 **Performance Ready** – Async model loading, throttled inference, frame downscaling, and simple temporal tracking keep things smooth on laptops and phones.
- 🎛️ **User Controls** – Minimal UI with status indicator and tap-to-toggle voice feedback.

## Quick Start

1. **Open `index.html`** in a modern browser (Chrome/Edge recommended). For mobile devices or browsers that block camera/voice on `file://`, serve it locally:

   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```

   Then visit `http://localhost:8000`.

2. **Allow camera access** when prompted. On iOS/Android be sure to use HTTPS or a trusted local network.

3. **Wait for the spinner** while the MobileNet weights download (first load only).

4. **Explore!** Move the camera around—labels will appear above detected objects. Toggle narration with the neon button in the lower-right corner.

## How It Works

- **AR Foundation**: AR.js (`THREEx.ArToolkit`) opens the webcam stream, aligns the projection matrix, and keeps Three.js synced with the video backdrop.
- **Detection Loop**: Every ~300 ms a downscaled frame is passed to `coco-ssd`. Bounding boxes are matched frame-to-frame via IoU so multiple instances stay stable.
- **3D Overlay**: Detections map from 2D screen coordinates into camera space, placing sprite-based labels at a fixed depth with easing.
- **Voice Engine**: A queue-based speech synthesizer narrates new objects (throttled so it won’t spam while an object stays in view).

## Controls & UI

- `Voice: ON/OFF` – toggles Web Speech narration and clears any queued audio.
- Status badge in the top bar shows loading, ready, or error states.

## Tech Stack

- **HTML / CSS / JavaScript (ES2023)**
- **Three.js 0.160** for rendering
- **AR.js 3.4** for camera + projection integration
- **TensorFlow.js 4.15** with **COCO-SSD (MobileNet)** for vision
- **Web Speech API** for narration

## Tips & Troubleshooting

- **Nothing shows up** – verify camera permission, adequate lighting, and that the page is served over HTTPS on mobile.
- **Model load is slow** – first-time downloads can take a moment; subsequent loads use browser cache.
- **Voice silent** – ensure the browser supports SpeechSynthesis (Safari/iOS require HTTPS) and that voice is toggled on.
- **Performance dips** – close other heavy tabs or lower display resolution; detection already runs on half-resolution frames.

## Project Structure

- `index.html` – shell markup, AR + AI script imports, HUD elements
- `style.css` – neon cyberpunk theme, responsive layout
- `script.js` – AR initialization, detection loop, label rendering, speech queue, UI wiring

Feel free to fork, remix, and build your own AR experiments on top of this foundation.

