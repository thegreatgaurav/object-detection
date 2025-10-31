// ============================================
// Neon AR Object Explorer - Main Application
// ============================================

const SETTINGS = Object.freeze({
    detectionThrottle: 300,
    detectionScale: 0.5,
    minConfidence: 0.5,
    disappearTimeout: 850,
    labelDistance: 3,
    labelLerp: 0.25,
    maxBoxes: 20
});

const SPEECH_COOLDOWN = 15000;

// Global variables
let video;
let canvas;
let scene;
let camera;
let renderer;
let arToolkitSource;
let arToolkitContext;
let detectionCanvas;
let detectionCtx;
let model;
let detectionInProgress = false;
let voiceEnabled = true;
let lastDetectionTime = 0;
let hasStarted = false;

const detectedObjects = new Map();

// Speech synthesis state
const speechQueue = [];
let isSpeaking = false;

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
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');

        if (!video || !canvas) {
            throw new Error('Required DOM elements are missing.');
        }

        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.muted = true;
        video.autoplay = true;

        // Prepare offscreen canvas for TensorFlow inference
        detectionCanvas = document.createElement('canvas');
        detectionCtx = detectionCanvas.getContext('2d');

        initThreeJS();

        updateStatus('Requesting camera access...');
        await initAR();

        updateStatus('Loading AI model...');
        model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });

        setupControls();

        updateStatus('Calibrating sensors...');
        document.getElementById('loading-overlay').classList.add('hidden');
        updateStatus('Ready');

        startDetectionLoop();

    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('Error: ' + error.message, true);
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        const welcome = document.getElementById('welcome-screen');
        if (welcome) {
            welcome.classList.remove('hidden');
        }
        document.body.classList.remove('experience-active');
        hasStarted = false;
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'Enter Experience';
        }
    }
}

// Initialize Three.js scene & renderer
function initThreeJS() {
    scene = new THREE.Scene();

    camera = new THREE.Camera();
    camera.matrixAutoUpdate = false;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (renderer.outputColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    window.addEventListener('resize', handleResize);

    animate();
}

// Initialize AR.js source & context
async function initAR() {
    if (typeof THREEx === 'undefined' || !THREEx.ArToolkitSource || !THREEx.ArToolkitContext) {
        throw new Error('AR.js failed to load.');
    }

    THREEx.ArToolkitContext.baseURL = 'https://cdn.jsdelivr.net/npm/ar.js@3.4.2/three.js/';

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
        facingMode: { ideal: 'environment' },
        sourceWidth: 1280,
        sourceHeight: 720,
        displayWidth: window.innerWidth,
        displayHeight: window.innerHeight,
        sourceElement: video
    });

    await new Promise((resolve, reject) => {
        arToolkitSource.init(
            () => {
                handleResize();
                resolve();
            },
            () => reject(new Error('Camera access denied or unavailable. Please allow camera permissions.'))
        );
    });

    try {
        await video.play();
    } catch (error) {
        console.warn('Autoplay prevented, waiting for user interaction.', error);
    }

    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://cdn.jsdelivr.net/npm/ar.js@3.4.2/data/data/camera_para.dat',
        detectionMode: 'mono',
        maxDetectionRate: 30,
        canvasWidth: 1280,
        canvasHeight: 720
    });

    await new Promise(resolve => {
        arToolkitContext.init(() => {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
            resolve();
        });
    });
}

// Handle window & video resize events
function handleResize() {
    if (!renderer) {
        return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    if (arToolkitSource) {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
        if (arToolkitContext && arToolkitContext.arController) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
        }
        if (video) {
            arToolkitSource.copyElementSizeTo(video);
        }
    }

    if (video) {
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
    }
}

// Begin detection loop
function startDetectionLoop() {
    requestAnimationFrame(detectionLoop);
}

async function detectionLoop() {
    requestAnimationFrame(detectionLoop);

    const frameSource = arToolkitSource && arToolkitSource.domElement ? arToolkitSource.domElement : video;

    if (!model || !frameSource || frameSource.readyState < 2) {
        return;
    }

    const now = performance.now();
    if (detectionInProgress || now - lastDetectionTime < SETTINGS.detectionThrottle) {
        return;
    }

    const sourceWidth = frameSource.videoWidth || video.videoWidth;
    const sourceHeight = frameSource.videoHeight || video.videoHeight;

    if (!sourceWidth || !sourceHeight) {
        return;
    }

    const scale = SETTINGS.detectionScale;
    const detectionWidth = Math.floor(sourceWidth * scale);
    const detectionHeight = Math.floor(sourceHeight * scale);

    if (!detectionWidth || !detectionHeight) {
        return;
    }

    detectionInProgress = true;
    lastDetectionTime = now;

    try {
        detectionCanvas.width = detectionWidth;
        detectionCanvas.height = detectionHeight;
        detectionCtx.drawImage(frameSource, 0, 0, detectionWidth, detectionHeight);
        const imageData = detectionCtx.getImageData(0, 0, detectionWidth, detectionHeight);
        const predictions = await model.detect(
            imageData,
            SETTINGS.maxBoxes,
            SETTINGS.minConfidence
        );
        processPredictions(predictions, scale, sourceWidth, sourceHeight);
    } catch (error) {
        console.error('Detection error:', error);
    } finally {
        detectionInProgress = false;
    }
}

function processPredictions(predictions, scale, sourceWidth, sourceHeight) {
    const now = performance.now();

    for (const entry of detectedObjects.values()) {
        entry.matched = false;
    }

    predictions.forEach(prediction => {
        if (prediction.score < SETTINGS.minConfidence) {
            return;
        }

        const bbox = {
            x: prediction.bbox[0] / scale,
            y: prediction.bbox[1] / scale,
            width: prediction.bbox[2] / scale,
            height: prediction.bbox[3] / scale
        };

        const centerX = bbox.x + bbox.width / 2;
        const labelY = Math.max(bbox.y - 60, 0);
        const worldPos = screenToWorld(centerX, labelY, sourceWidth, sourceHeight);

        const matchId = findMatchingDetection(prediction.class, bbox);
        if (matchId) {
            const entry = detectedObjects.get(matchId);
            entry.matched = true;
            entry.lastSeen = now;
            entry.bbox = bbox;
            entry.sprite.position.lerp(worldPos, SETTINGS.labelLerp);

            if (Math.abs(entry.lastConfidence - prediction.score) > 0.05) {
                updateLabelTexture(entry.sprite, entry.data, prediction.score);
                entry.lastConfidence = prediction.score;
            }

            if (voiceEnabled && now - (entry.lastSpoken || 0) > SPEECH_COOLDOWN) {
                queueSpeech(entry.data.name, entry.data.info);
                entry.lastSpoken = now;
            }

        } else {
            const objectData = OBJECT_DATABASE[prediction.class] || {
                name: formatLabelName(prediction.class),
                info: DEFAULT_OBJECT.info
            };

            const sprite = createLabel(objectData, prediction.score);
            sprite.position.copy(worldPos);
            scene.add(sprite);

            const id = createDetectionId();
            detectedObjects.set(id, {
                id,
                className: prediction.class,
                sprite,
                data: objectData,
                bbox,
                lastSeen: now,
                lastConfidence: prediction.score,
                matched: true,
                lastSpoken: voiceEnabled ? now : 0
            });

            if (voiceEnabled) {
                queueSpeech(objectData.name, objectData.info);
            }
        }
    });

    for (const [id, entry] of detectedObjects.entries()) {
        if (!entry.matched) {
            if (now - entry.lastSeen > SETTINGS.disappearTimeout) {
                removeLabel(entry.sprite);
                detectedObjects.delete(id);
            }
        } else {
            entry.matched = false;
        }
    }
}

function findMatchingDetection(className, bbox) {
    let bestId = null;
    let bestIou = 0;

    for (const [id, entry] of detectedObjects.entries()) {
        if (entry.className !== className || !entry.bbox) {
            continue;
        }

        const iou = computeIoU(entry.bbox, bbox);
        if (iou > 0.2 && iou > bestIou) {
            bestIou = iou;
            bestId = id;
        }
    }

    return bestId;
}

function computeIoU(a, b) {
    const xA = Math.max(a.x, b.x);
    const yA = Math.max(a.y, b.y);
    const xB = Math.min(a.x + a.width, b.x + b.width);
    const yB = Math.min(a.y + a.height, b.y + b.height);

    const interWidth = Math.max(0, xB - xA);
    const interHeight = Math.max(0, yB - yA);
    const interArea = interWidth * interHeight;

    if (interArea <= 0) {
        return 0;
    }

    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return interArea / (areaA + areaB - interArea);
}

function screenToWorld(x, y, videoWidth, videoHeight) {
    if (!camera) {
        return new THREE.Vector3();
    }

    const ndcX = (x / videoWidth) * 2 - 1;
    const ndcY = -(y / videoHeight) * 2 + 1;

    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(camera);

    const direction = vector.sub(camera.position).normalize();
    const distance = SETTINGS.labelDistance;
    return camera.position.clone().add(direction.multiplyScalar(distance));
}

function createLabel(objectData, confidence) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const labelCtx = labelCanvas.getContext('2d');

    drawLabelTexture(labelCtx, labelCanvas, objectData, confidence);

    const texture = new THREE.CanvasTexture(labelCanvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.4, 1.2, 1);
    sprite.userData.canvas = labelCanvas;
    sprite.userData.context = labelCtx;

    animateOpacity(sprite, 0, 1, 500);
    return sprite;
}

function drawLabelTexture(ctx2d, canvas2d, objectData, confidence) {
    ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);

    ctx2d.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx2d.fillRect(0, 0, canvas2d.width, canvas2d.height);

    ctx2d.strokeStyle = '#00ff41';
    ctx2d.lineWidth = 4;
    ctx2d.strokeRect(2, 2, canvas2d.width - 4, canvas2d.height - 4);

    ctx2d.fillStyle = '#00ff41';
    ctx2d.font = 'bold 36px "Courier New", monospace';
    ctx2d.textAlign = 'center';
    ctx2d.fillText(objectData.name, canvas2d.width / 2, 72);

    ctx2d.fillStyle = '#00ff88';
    ctx2d.font = '22px "Courier New", monospace';
    ctx2d.fillText(`${Math.round(confidence * 100)}% confidence`, canvas2d.width / 2, 120);

    ctx2d.fillStyle = '#ffffff';
    ctx2d.font = '20px "Courier New", monospace';
    wrapText(ctx2d, objectData.info, canvas2d.width / 2, 168, canvas2d.width - 60, 28);
}

function wrapText(ctx2d, text, centerX, startY, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach(word => {
        const testLine = `${line}${word} `;
        if (ctx2d.measureText(testLine).width > maxWidth && line !== '') {
            lines.push(line.trim());
            line = `${word} `;
        } else {
            line = testLine;
        }
    });

    if (line) {
        lines.push(line.trim());
    }

    lines.slice(0, 3).forEach((segment, index) => {
        ctx2d.fillText(segment, centerX, startY + index * lineHeight);
    });
}

function updateLabelTexture(sprite, objectData, confidence) {
    const ctx2d = sprite.userData.context;
    const canvas2d = sprite.userData.canvas;
    if (!ctx2d || !canvas2d) {
        return;
    }

    drawLabelTexture(ctx2d, canvas2d, objectData, confidence);
    sprite.material.map.needsUpdate = true;
}

function animateOpacity(sprite, from, to, duration) {
    const startTime = performance.now();
    const startingOpacity = from;
    sprite.material.opacity = startingOpacity;

    function update() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        sprite.material.opacity = startingOpacity + (to - startingOpacity) * eased;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function removeLabel(sprite) {
    if (!sprite) {
        return;
    }

    const currentOpacity = sprite.material.opacity;
    animateOpacity(sprite, currentOpacity, 0, 250);
    setTimeout(() => {
        scene.remove(sprite);
        if (sprite.material.map) {
            sprite.material.map.dispose();
        }
        sprite.material.dispose();
    }, 260);
}

function queueSpeech(name, info) {
    if (!('speechSynthesis' in window)) {
        return;
    }

    speechQueue.push({ name, info });
    processSpeechQueue();
}

function processSpeechQueue() {
    if (!voiceEnabled || isSpeaking || speechQueue.length === 0) {
        return;
    }

    isSpeaking = true;
    const { name, info } = speechQueue.shift();
    const utterance = new SpeechSynthesisUtterance(`${name}. ${info}`);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.85;

    utterance.onend = () => {
        isSpeaking = false;
        setTimeout(processSpeechQueue, 400);
    };

    utterance.onerror = () => {
        isSpeaking = false;
        processSpeechQueue();
    };

    window.speechSynthesis.speak(utterance);
}

function setupControls() {
    const voiceToggle = document.getElementById('voice-toggle');
    if (!voiceToggle) {
        return;
    }

    voiceToggle.classList.toggle('active', voiceEnabled);
    const label = voiceToggle.querySelector('.label');
    if (label) {
        label.textContent = `Voice: ${voiceEnabled ? 'ON' : 'OFF'}`;
    }

    voiceToggle.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        voiceToggle.classList.toggle('active', voiceEnabled);
        if (label) {
            label.textContent = `Voice: ${voiceEnabled ? 'ON' : 'OFF'}`;
        }

        if (!voiceEnabled) {
            window.speechSynthesis.cancel();
            speechQueue.length = 0;
            isSpeaking = false;
        } else {
            processSpeechQueue();
        }
    });
}

function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('status');
    if (!statusEl) {
        return;
    }

    statusEl.textContent = message;
    statusEl.classList.remove('ready', 'error');
    statusEl.classList.add(isError ? 'error' : 'ready');
}

function animate() {
    requestAnimationFrame(animate);

    if (arToolkitSource && arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
    }

    renderer.render(scene, camera);
}

function createDetectionId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    return `det-${Math.random().toString(36).slice(2, 10)}`;
}

function formatLabelName(name) {
    return name
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function setupWelcome() {
    updateStatus('Awaiting launch...');
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }

    if (!startBtn) {
        return;
    }

    startBtn.addEventListener('click', () => {
        if (hasStarted) {
            return;
        }

        hasStarted = true;
        startBtn.disabled = true;
        startBtn.textContent = 'Initializing...';

        document.body.classList.add('experience-active');
        const welcome = document.getElementById('welcome-screen');
        if (welcome) {
            welcome.classList.add('hidden');
        }

        if (overlay) {
            overlay.classList.remove('hidden');
        }

        updateStatus('Booting sensors...');
        init();
    });
}

// Initialize welcome flow when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWelcome);
} else {
    setupWelcome();
}

