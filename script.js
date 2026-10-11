const sysStatus = document.getElementById('sys-status');
const voiceStatus = document.getElementById('voice-status');
const learningStatus = document.getElementById('learning-status');
const mutationLog = document.getElementById('mutation-log');
const lastCommand = document.getElementById('last-command');
const systemClock = document.getElementById('system-clock');

let recognition;
let isSpeaking = false;
let cooldownUntil = 0;
let optimizationCount = 0;

setInterval(() => {
    const now = new Date();
    systemClock.innerText = now.toLocaleTimeString();
}, 1000);

async function initCameraStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('webcam').srcObject = stream;
        document.getElementById('diag-camera').innerText = "SECURED";
    } catch (err) {
        console.error("Camera access error:", err);
        document.getElementById('diag-camera').innerText = "BLOCKED";
        sysStatus.innerText = "ERROR: CAMERA PERMISSION DENIED";
    }
}
initCameraStream();

function speakResponse(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        
        speech.lang = navigator.language || 'en-US';
        speech.rate = 1.05;
        speech.pitch = 0.95;

        isSpeaking = true;
        voiceStatus.innerText = "VOICE: SPEAKING...";
        document.getElementById('diag-speech').innerText = "SPEAKING";

        speech.onend = () => {
            isSpeaking = false;
            cooldownUntil = Date.now() + 3000; 
            voiceStatus.innerText = "VOICE: LISTENING...";
            document.getElementById('diag-speech').innerText = "LISTENING";
        };

        window.speechSynthesis.speak(speech);
    }
}

function executeSelfImprovementMatrix(command) {
    optimizationCount++;
    learningStatus.innerText = `Optimizations: ${optimizationCount}`;
    
    if (optimizationCount % 5 === 0) {
        mutationLog.innerText = `State: Upgraded Weight Matrix #${optimizationCount}`;
    }
    console.log(`[Self-Correction Engine]: Indexed query pattern for: "${command}"`);
}

function processAIBrain(command) {
    const text = command.toLowerCase().trim();
    let responseText = "";

    sysStatus.innerText = `HEARD: "${command.toUpperCase()}"`;
    lastCommand.innerText = `Last: "${command}"`;
    
    executeSelfImprovementMatrix(command);

    if (text.includes("python") || text.includes("def ") || text.includes("pip ")) {
        responseText = "Python subsystem active. Enforce 4-space indentation and utilize NumPy or Pandas.";
    } 
    else if (text.includes("java") || text.includes("class ") || text.includes("public static")) {
        responseText = "Java expert module active. Static typing and JVM runtime parameters are nominal.";
    } 
    else if (text.includes("c++") || text.includes("cpp") || text.includes("include<")) {
        responseText = "C++ compiler link engaged. Managing manual memory allocation and pointer references.";
    } 
    else if (text.includes("c language") || text === "c" || text.includes("printf")) {
        responseText = "C language standard loaded. Procedural memory pointers and stdio headers initialized.";
    }
    else if (text.includes("javascript") || text.includes("js") || text.includes("async")) {
        responseText = "JavaScript asynchronous engine ready. Handling event loops and DOM manipulation.";
    }
    else if (text.includes("translate") || text.includes("language") || text.includes("speak in")) {
        responseText = `Multilingual gateway active. Supporting over 50 global dialects. Active locale: ${navigator.language}.`;
    }
    else if (text.includes("status") || text.includes("diagnostics") || text.includes("system")) {
        responseText = `All systems fully operational. Self-improvement engine has executed ${optimizationCount} local pattern adaptations.`;
    }
    else {
        responseText = `Processing query regarding "${command}". Coding libraries and global language matrices synchronized, Chandresh.`;
    }

    setTimeout(() => {
        sysStatus.innerText = `E.D.I.T.H.: ${responseText}`;
        speakResponse(responseText);
    }, 300);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-US';
    document.getElementById('diag-locale').innerText = recognition.lang;

    recognition.onresult = (event) => {
        if (isSpeaking || Date.now() < cooldownUntil) return;

        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Voice Command Captured:", transcript);
        processAIBrain(transcript);
    };

    recognition.onerror = (event) => {
        console.warn("Speech Recognition Error:", event.error);
        voiceStatus.innerText = `VOICE ERROR: ${event.error.toUpperCase()}`;
        
        if (event.error === 'not-allowed') {
            sysStatus.innerText = "ERROR: MICROPHONE PERMISSION BLOCKED";
        }
    };

    recognition.onend = () => {
        try {
            if (!isSpeaking && Date.now() >= cooldownUntil) {
                recognition.start();
            }
        } catch (e) {
            console.log("Recognition restart loop active.");
        }
    };

    try {
        recognition.start();
        voiceStatus.innerText = "VOICE: LISTENING...";
        document.getElementById('diag-speech').innerText = "LISTENING";
        speakResponse("E.D.I.T.H. core online. Multilingual and coding subsystems fully engaged.");
    } catch (err) {
        console.error("Recognition start error:", err);
    }
} else {
    voiceStatus.innerText = "SPEECH API NOT SUPPORTED";
    sysStatus.innerText = "ERROR: BROWSER SPEECH UNSUPPORTED";
}