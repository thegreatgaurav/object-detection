// ============================================
// AR Object Visualizer - Main Application
// ============================================

// Global variables
let video;
let canvas;
let ctx;
let detectionCanvas; // Separate canvas for detection
let detectionCtx;
let scene;
let camera;
let renderer;
let model;
let detectedObjects = new Map(); // Track detected objects by class name
let voiceEnabled = true;
let lastDetectionTime = 0;
const DETECTION_THROTTLE = 300; // ms between detections

// Object database with fun facts
const OBJECT_DATABASE = {
    person: {
        name: "Person",
        info: "Humans have about 37 trillion cells in their body!"
    },
    bicycle: {
        name: "Bicycle",
        info: "The first bicycle was invented in 1817 and had no pedals!"
    },
    car: {
        name: "Car",
        info: "The first car was built in 1886 by Karl Benz!"
    },
    motorcycle: {
        name: "Motorcycle",
        info: "Motorcycles can achieve better fuel efficiency than cars!"
    },
    airplane: {
        name: "Airplane",
        info: "The Wright brothers' first flight lasted only 12 seconds!"
    },
    bus: {
        name: "Bus",
        info: "The first bus service started in Paris in 1662!"
    },
    train: {
        name: "Train",
        info: "The fastest train can reach speeds over 400 km/h!"
    },
    truck: {
        name: "Truck",
        info: "Trucks transport 70% of all freight in the United States!"
    },
    boat: {
        name: "Boat",
        info: "The oldest boat ever found is over 8,000 years old!"
    },
    traffic_light: {
        name: "Traffic Light",
        info: "The first traffic light was installed in 1868 in London!"
    },
    fire_hydrant: {
        name: "Fire Hydrant",
        info: "Fire hydrants were invented in the early 1800s!"
    },
    stop_sign: {
        name: "Stop Sign",
        info: "Stop signs are octagonal because it's easy to recognize even when upside down!"
    },
    parking_meter: {
        name: "Parking Meter",
        info: "The first parking meter was installed in 1935 in Oklahoma!"
    },
    bench: {
        name: "Bench",
        info: "Public benches promote community interaction and rest!"
    },
    bird: {
        name: "Bird",
        info: "Birds are descendants of dinosaurs - specifically theropods!"
    },
    cat: {
        name: "Cat",
        info: "Cats can make over 100 different sounds!"
    },
    dog: {
        name: "Dog",
        info: "Dogs can smell 10,000 to 100,000 times better than humans!"
    },
    horse: {
        name: "Horse",
        info: "Horses can sleep both lying down and standing up!"
    },
    sheep: {
        name: "Sheep",
        info: "Sheep have excellent memories and can recognize up to 50 faces!"
    },
    cow: {
        name: "Cow",
        info: "Cows have best friends and become stressed when separated!"
    },
    elephant: {
        name: "Elephant",
        info: "Elephants are the only mammals that can't jump!"
    },
    bear: {
        name: "Bear",
        info: "Bears can run up to 35 miles per hour!"
    },
    zebra: {
        name: "Zebra",
        info: "A zebra's stripes are unique like human fingerprints!"
    },
    giraffe: {
        name: "Giraffe",
        info: "Giraffes only need 5 to 30 minutes of sleep per day!"
    },
    backpack: {
        name: "Backpack",
        info: "Modern backpacks distribute weight evenly across shoulders!"
    },
    umbrella: {
        name: "Umbrella",
        info: "Umbrellas were originally used for shade, not rain!"
    },
    handbag: {
        name: "Handbag",
        info: "The oldest handbag dates back to 4500 BC!"
    },
    tie: {
        name: "Tie",
        info: "Neckties originated from Croatian mercenaries in the 17th century!"
    },
    suitcase: {
        name: "Suitcase",
        info: "The first wheeled suitcase was invented in 1970!"
    },
    frisbee: {
        name: "Frisbee",
        info: "Frisbees were originally pie tins from the Frisbie Pie Company!"
    },
    skis: {
        name: "Skis",
        info: "The oldest known skis are over 8,000 years old!"
    },
    snowboard: {
        name: "Snowboard",
        info: "Snowboarding became an Olympic sport in 1998!"
    },
    sports_ball: {
        name: "Sports Ball",
        info: "The first rubber basketball was made in 1894!"
    },
    kite: {
        name: "Kite",
        info: "Kites were first used in China over 2,000 years ago!"
    },
    baseball_bat: {
        name: "Baseball Bat",
        info: "Baseball bats were originally flat, like cricket bats!"
    },
    baseball_glove: {
        name: "Baseball Glove",
        info: "The first baseball gloves were made of leather in the 1870s!"
    },
    skateboard: {
        name: "Skateboard",
        info: "Skateboarding started as 'sidewalk surfing' in California!"
    },
    surfboard: {
        name: "Surfboard",
        info: "Ancient surfboards were made from wood and could be 15 feet long!"
    },
    tennis_racket: {
        name: "Tennis Racket",
        info: "Tennis rackets were originally made of wood until the 1980s!"
    },
    bottle: {
        name: "Bottle",
        info: "Glass bottles can be recycled endlessly without losing quality!"
    },
    wine_glass: {
        name: "Wine Glass",
        info: "The shape of wine glasses affects the taste of wine!"
    },
    cup: {
        name: "Cup",
        info: "Cups have been used for over 5,000 years!"
    },
    fork: {
        name: "Fork",
        info: "Forks were once considered immoral in some cultures!"
    },
    knife: {
        name: "Knife",
        info: "The oldest known knives date back 2.5 million years!"
    },
    spoon: {
        name: "Spoon",
        info: "Spoons are the oldest utensil, dating back 20,000 years!"
    },
    bowl: {
        name: "Bowl",
        info: "Bowls have been found in archaeological sites worldwide!"
    },
    banana: {
        name: "Banana",
        info: "Bananas are berries, but strawberries aren't!"
    },
    apple: {
        name: "Apple",
        info: "Apples float because 25% of their volume is air!"
    },
    sandwich: {
        name: "Sandwich",
        info: "The sandwich is named after the 4th Earl of Sandwich!"
    },
    orange: {
        name: "Orange",
        info: "Oranges are actually a type of berry called a hesperidium!"
    },
    broccoli: {
        name: "Broccoli",
        info: "Broccoli is a man-made vegetable, bred from wild cabbage!"
    },
    carrot: {
        name: "Carrot",
        info: "Originally, carrots were purple, not orange!"
    },
    hot_dog: {
        name: "Hot Dog",
        info: "Hot dogs were invented in Germany, not America!"
    },
    pizza: {
        name: "Pizza",
        info: "The first pizza was made in Naples, Italy in the 18th century!"
    },
    donut: {
        name: "Donut",
        info: "The hole in donuts prevents the center from being undercooked!"
    },
    cake: {
        name: "Cake",
        info: "The oldest cake recipe dates back to ancient Egypt!"
    },
    chair: {
        name: "Chair",
        info: "Chairs became common furniture around 5,000 years ago!"
    },
    couch: {
        name: "Couch",
        info: "Couches evolved from benches and were once a status symbol!"
    },
    potted_plant: {
        name: "Potted Plant",
        info: "Potted plants can improve indoor air quality by up to 60%!"
    },
    bed: {
        name: "Bed",
        info: "Humans spend about one-third of their lives sleeping!"
    },
    dining_table: {
        name: "Dining Table",
        info: "Tables have been used for dining for over 4,000 years!"
    },
    toilet: {
        name: "Toilet",
        info: "The first flushing toilet was invented in 1596!"
    },
    tv: {
        name: "TV",
        info: "The first TV was demonstrated in 1927 by Philo Farnsworth!"
    },
    laptop: {
        name: "Laptop",
        info: "The first laptop weighed 25 pounds and cost $10,000!"
    },
    mouse: {
        name: "Computer Mouse",
        info: "The mouse was invented in 1964 and was originally called an 'X-Y Position Indicator'!"
    },
    remote: {
        name: "Remote",
        info: "The first TV remote was called 'Lazy Bones' and was connected by wire!"
    },
    keyboard: {
        name: "Keyboard",
        info: "QWERTY layout was designed to slow typists down to prevent jamming!"
    },
    cell_phone: {
        name: "Cell Phone",
        info: "The first cell phone call was made in 1973 and lasted 10 minutes!"
    },
    microwave: {
        name: "Microwave",
        info: "The microwave was invented by accident in 1945!"
    },
    oven: {
        name: "Oven",
        info: "The first ovens date back to 29,000 BC!"
    },
    toaster: {
        name: "Toaster",
        info: "The first electric toaster was invented in 1893!"
    },
    sink: {
        name: "Sink",
        info: "Modern sinks use less water than ever before!"
    },
    refrigerator: {
        name: "Refrigerator",
        info: "Refrigerators use more energy than any other kitchen appliance!"
    },
    book: {
        name: "Book",
        info: "The first books were made of clay tablets in ancient Mesopotamia!"
    },
    clock: {
        name: "Clock",
        info: "The first mechanical clock was built in China in 725 AD!"
    },
    vase: {
        name: "Vase",
        info: "The oldest vases date back to ancient Greece!"
    },
    scissors: {
        name: "Scissors",
        info: "Scissors were invented in ancient Egypt around 1500 BC!"
    },
    teddy_bear: {
        name: "Teddy Bear",
        info: "Teddy bears are named after President Theodore Roosevelt!"
    },
    hair_dryer: {
        name: "Hair Dryer",
        info: "The first hair dryer was invented in 1888 and was very dangerous!"
    },
    toothbrush: {
        name: "Toothbrush",
        info: "The first toothbrush was made in China in 1498!"
    }
};

// Default fallback for unknown objects
const DEFAULT_OBJECT = {
    name: "Object",
    info: "An interesting object detected in the real world!"
};

// Initialize application
async function init() {
    try {
        // Get DOM elements
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        
        // Create separate canvas for detection (offscreen, not in DOM)
        detectionCanvas = document.createElement('canvas');
        detectionCtx = detectionCanvas.getContext('2d');
        
        // Set canvas size
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Initialize camera
        await initCamera();
        
        // Initialize Three.js scene
        initThreeJS();
        
        // Load AI model
        updateStatus('Loading AI Model...');
        model = await cocoSsd.load();
        updateStatus('Ready');
        document.getElementById('loading-overlay').classList.add('hidden');
        
        // Start detection loop
        startDetectionLoop();
        
        // Setup UI controls
        setupControls();
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('Error: ' + error.message, true);
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}

// Initialize camera
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        await video.play();
    } catch (error) {
        throw new Error('Camera access denied or unavailable. Please allow camera permissions.');
    }
}

// Resize canvas to match video
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (renderer) {
        renderer.setSize(canvas.width, canvas.height);
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
    }
}

// Initialize Three.js scene
function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera (orthographic for 2D overlay effect)
    camera = new THREE.PerspectiveCamera(
        75,
        canvas.width / canvas.height,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Start render loop
    animate();
}

// Create 3D label for detected object
function createLabel(objectData, confidence) {
    const canvas2d = document.createElement('canvas');
    const ctx2d = canvas2d.getContext('2d');
    canvas2d.width = 512;
    canvas2d.height = 256;
    
    // Draw label background
    ctx2d.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx2d.fillRect(0, 0, canvas2d.width, canvas2d.height);
    
    // Draw border
    ctx2d.strokeStyle = '#00ff41';
    ctx2d.lineWidth = 4;
    ctx2d.strokeRect(2, 2, canvas2d.width - 4, canvas2d.height - 4);
    
    // Draw text
    ctx2d.fillStyle = '#00ff41';
    ctx2d.font = 'bold 32px "Courier New", monospace';
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    
    // Object name
    ctx2d.fillText(objectData.name, canvas2d.width / 2, 70);
    
    // Confidence
    ctx2d.font = '20px "Courier New", monospace';
    ctx2d.fillStyle = '#00ff88';
    ctx2d.fillText(`${Math.round(confidence * 100)}% confident`, canvas2d.width / 2, 110);
    
    // Info text (split if too long)
    ctx2d.font = '18px "Courier New", monospace';
    ctx2d.fillStyle = '#ffffff';
    const words = objectData.info.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx2d.measureText(testLine);
        if (metrics.width > canvas2d.width - 40 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    if (currentLine) lines.push(currentLine);
    
    lines.slice(0, 3).forEach((line, index) => {
        ctx2d.fillText(line.trim(), canvas2d.width / 2, 150 + index * 30);
    });
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas2d);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2, 1, 1);
    
    // Fade in animation
    animateOpacity(sprite, 0, 1, 500);
    
    return sprite;
}

// Animate opacity
function animateOpacity(sprite, from, to, duration) {
    const startTime = Date.now();
    const startOpacity = sprite.material.opacity;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        sprite.material.opacity = startOpacity + (to - startOpacity) * easeProgress;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Remove label with fade out
function removeLabel(sprite) {
    animateOpacity(sprite, sprite.material.opacity, 0, 300);
    setTimeout(() => {
        scene.remove(sprite);
        sprite.material.dispose();
        sprite.material.map.dispose();
    }, 300);
}

// Convert 2D screen coordinates to 3D world coordinates
function screenToWorld(x, y, width, height, videoWidth, videoHeight) {
    // Normalize coordinates
    const normalizedX = (x / videoWidth) * 2 - 1;
    const normalizedY = 1 - (y / videoHeight) * 2; // Flip Y axis
    
    // Scale to canvas dimensions
    const aspect = canvas.width / canvas.height;
    const videoAspect = videoWidth / videoHeight;
    
    let scaleX = 1;
    let scaleY = 1;
    
    if (videoAspect > aspect) {
        scaleY = videoAspect / aspect;
    } else {
        scaleX = aspect / videoAspect;
    }
    
    const worldX = normalizedX * scaleX * 5;
    const worldY = normalizedY * scaleY * 5;
    
    return new THREE.Vector3(worldX, worldY, 0);
}

// Object detection loop
async function startDetectionLoop() {
    async function detect() {
        if (!video.videoWidth || !video.videoHeight) {
            requestAnimationFrame(detect);
            return;
        }
        
        const now = Date.now();
        if (now - lastDetectionTime < DETECTION_THROTTLE) {
            requestAnimationFrame(detect);
            return;
        }
        lastDetectionTime = now;
        
        try {
            // Resize frame for better performance
            const scale = 0.5;
            const detectionWidth = Math.floor(video.videoWidth * scale);
            const detectionHeight = Math.floor(video.videoHeight * scale);
            
            // Set detection canvas size and draw video frame
            detectionCanvas.width = detectionWidth;
            detectionCanvas.height = detectionHeight;
            detectionCtx.drawImage(video, 0, 0, detectionWidth, detectionHeight);
            const imageData = detectionCtx.getImageData(0, 0, detectionWidth, detectionHeight);
            
            // Run detection
            const predictions = await model.detect(imageData);
            
            // Update detected objects
            const currentObjects = new Set();
            
            predictions.forEach(prediction => {
                const className = prediction.class;
                currentObjects.add(className);
                
                // Get object data
                const objectData = OBJECT_DATABASE[className] || {
                    name: className.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    info: DEFAULT_OBJECT.info
                };
                
                // Calculate label position (center-top of bounding box)
                const centerX = (prediction.bbox[0] + prediction.bbox[2] / 2) / scale;
                const centerY = prediction.bbox[1] / scale;
                
                // Convert to world coordinates
                const worldPos = screenToWorld(
                    centerX,
                    centerY - 30, // Offset above object
                    video.videoWidth,
                    video.videoHeight,
                    video.videoWidth,
                    video.videoHeight
                );
                
                // Update or create label
                if (detectedObjects.has(className)) {
                    const sprite = detectedObjects.get(className).sprite;
                    sprite.position.copy(worldPos);
                } else {
                    const sprite = createLabel(objectData, prediction.score);
                    sprite.position.copy(worldPos);
                    scene.add(sprite);
                    detectedObjects.set(className, {
                        sprite: sprite,
                        data: objectData,
                        confidence: prediction.score
                    });
                    
                    // Speak object name and info
                    if (voiceEnabled) {
                        speakObject(objectData.name, objectData.info);
                    }
                }
            });
            
            // Remove labels for objects no longer detected
            for (const [className, obj] of detectedObjects.entries()) {
                if (!currentObjects.has(className)) {
                    removeLabel(obj.sprite);
                    detectedObjects.delete(className);
                }
            }
            
        } catch (error) {
            console.error('Detection error:', error);
        }
        
        requestAnimationFrame(detect);
    }
    
    detect();
}

// Speech synthesis
let speechQueue = [];
let isSpeaking = false;

function speakObject(name, info) {
    speechQueue.push({ name, info });
    processSpeechQueue();
}

function processSpeechQueue() {
    if (isSpeaking || speechQueue.length === 0) return;
    
    isSpeaking = true;
    const { name, info } = speechQueue.shift();
    
    const utterance = new SpeechSynthesisUtterance(`${name}. ${info}`);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
        isSpeaking = false;
        setTimeout(processSpeechQueue, 500); // Small delay between speeches
    };
    
    utterance.onerror = () => {
        isSpeaking = false;
        processSpeechQueue();
    };
    
    window.speechSynthesis.speak(utterance);
}

// UI Controls
function setupControls() {
    const voiceToggle = document.getElementById('voice-toggle');
    
    voiceToggle.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        const label = voiceToggle.querySelector('.label');
        label.textContent = `Voice: ${voiceEnabled ? 'ON' : 'OFF'}`;
        voiceToggle.classList.toggle('active', voiceEnabled);
        
        if (!voiceEnabled) {
            window.speechSynthesis.cancel();
            speechQueue = [];
            isSpeaking = false;
        }
    });
}

// Update status
function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = isError ? 'error' : 'ready';
}

// Three.js render loop
function animate() {
    requestAnimationFrame(animate);
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

