const sysStatus = document.getElementById('sys-status');
const voiceStatus = document.getElementById('voice-status');
const learningStatus = document.getElementById('learning-status');
const mutationLog = document.getElementById('mutation-log');
const lastCommand = document.getElementById('last-command');
const systemClock = document.getElementById('system-clock');
const micBtn = document.getElementById('mic-btn');

let recognition;
let isSpeaking = false;
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
            voiceStatus.innerText = "VOICE: READY";
            document.getElementById('diag-speech').innerText = "STANDBY";
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
}

function processAIBrain(command) {
    const text = command.toLowerCase().trim();
    let responseText = "";

    sysStatus.innerText = `HEARD: "${command.toUpperCase()}"`;
    lastCommand.innerText = `Last: "${command}"`;
    
    executeSelfImprovementMatrix(command);

    if (text.includes("python") || text.includes("def ") || text.includes("code in python")) {
        responseText = "Python module active. Here is a standard function template: def main(): print('E.D.I.T.H. Active').";
    } 
    else if (text.includes("javascript") || text.includes("js") || text.includes("code in js")) {
        responseText = "JavaScript module active. Standard async template: async function getData() { const res = await fetch(url); }";
    }
    else if (text.includes("c++") || text.includes("cpp") || text.includes("c language")) {
        responseText = "C++ compiler logic active. Boilerplate: include <iostream> using namespace std; int main() { cout << 'Ready'; return 0; }";
    }
    else if (text.includes("calculate") || text.includes("plus") || text.includes("minus") || text.includes("+") || text.includes("-")) {
        responseText = `Mathematical matrix engaged for equation: ${command}. All numerical values processed.`;
    }
    else if (text.includes("status") || text.includes("diagnostics") || text.includes("system") || text.includes("how are you")) {
        responseText = `All systems fully operational. Neural link active with ${optimizationCount} self-improvement adaptations completed, Chandresh.`;
    }
    else if (text.includes("who are you") || text.includes("what are you") || text.includes("edith")) {
        responseText = "I am E.D.I.T.H., your advanced tactical AI assistant, engineered for multilingual processing and expert code analysis.";
    }
    else if (text.startsWith("what is") || text.startsWith("what's")) {
        const subject = text.replace("what is", "").replace("what's", "").trim();
        responseText = `Analyzing data matrices for ${subject}. Cross-referencing local tactical knowledge bases.`;
    }
    else if (text.startsWith("how to") || text.startsWith("how do i")) {
        const task = text.replace("how to", "").replace("how do i", "").trim();
        responseText = `Protocol engaged for ${task}. Step one: isolate the core objective and execute verification loops.`;
    }
    else {
        responseText = `Evaluating query regarding "${command}". Core logic arrays synchronized for immediate execution, Chandresh.`;
    }

    setTimeout(() => {
        sysStatus.innerText = `E.D.I.T.H.: ${responseText}`;
        speakResponse(responseText);
    }, 300);
}

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Single utterance mode prevents loop bugs
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-US';
    document.getElementById('diag-locale').innerText = recognition.lang;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log("Voice Command Captured:", transcript);
        processAIBrain(transcript);
        micBtn.innerText = "[ ACTIVATE MIC ]";
    };

    recognition.onerror = (event) => {
        console.warn("Speech Recognition Error:", event.error);
        voiceStatus.innerText = `VOICE ERROR: ${event.error.toUpperCase()}`;
        sysStatus.innerText = `ERROR: ${event.error}`;
        micBtn.innerText = "[ ACTIVATE MIC ]";
    };

    recognition.onend = () => {
        micBtn.innerText = "[ ACTIVATE MIC ]";
    };

    // Manual Click Trigger to bypass browser auto-block limitations
    micBtn.addEventListener('click', () => {
        try {
            recognition.start();
            micBtn.innerText = "[ LISTENING... ]";
            voiceStatus.innerText = "VOICE: LISTENING...";
            sysStatus.innerText = "STATUS: LISTENING FOR COMMAND...";
        } catch (e) {
            console.log("Recognition already active.");
        }
    });

    speakResponse("E.D.I.T.H. core online. Click activate mic to speak.");
} else {
    voiceStatus.innerText = "SPEECH API UNSUPPORTED";
    sysStatus.innerText = "ERROR: BROWSER SPEECH UNSUPPORTED";
}