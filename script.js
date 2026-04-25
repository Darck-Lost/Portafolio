////////// ESTADO GLOBAL
const AppState = {
    mouseX: 0,
    mouseY: 0,
    terminal: null,
    logContainer: null,
    logInterval: null,
    dotInterval: null,
    animationFrameId: null,
    isRunning: false,
    lineIndex: 0,
    charIndex: 0
};

////////// CONFIG
const TERMINAL_LINES = [
    "$ whoami",
    "fernando_mendoza",
    "$ skills",
    "linux networking zabbix git ssh",
    "$ status",
    "available_for_work",
    "$ uptime",
    "99.9% uptime"
];

const LOGS = [
    "Conexión establecida con nodo 192.168.1.10",
    "Monitoreo activo en interfaz eth0",
    "Sincronización completada correctamente",
    "Alerta: latencia detectada (resuelta)",
    "Backup realizado exitosamente"
];

////////// INIT
document.addEventListener("DOMContentLoaded", () => {
    AppState.terminal = document.getElementById("terminal");
    AppState.logContainer = document.getElementById("logs");

    initFadeIn();
    initCursorTracking();
    initVisibilityControl();

    startApp();
});

////////// CONTROL PRINCIPAL
function startApp() {
    if (AppState.isRunning) return;

    AppState.isRunning = true;

    animateGlow();
    typeLine();
    AppState.logInterval = setInterval(addLog, 2000);
    AppState.dotInterval = setInterval(createDot, 1200);
}

function stopApp() {
    AppState.isRunning = false;

    clearInterval(AppState.logInterval);
    clearInterval(AppState.dotInterval);
    cancelAnimationFrame(AppState.animationFrameId);
}

function resetApp() {
    stopApp();

    AppState.terminal.innerHTML = "";
    AppState.logContainer.innerHTML = "";

    AppState.lineIndex = 0;
    AppState.charIndex = 0;

    document.querySelectorAll(".network-dot").forEach(dot => dot.remove());

    startApp();
}

////////// VISIBILITY CONTROL
function initVisibilityControl() {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            stopApp();
        } else {
            startApp();
        }
    });
}

////////// CURSOR
function initCursorTracking() {
    document.addEventListener("mousemove", e => {
        AppState.mouseX = e.clientX;
        AppState.mouseY = e.clientY;
    });
}

function animateGlow() {
    const glow = document.querySelector(".cursor-glow");

    glow.style.left = AppState.mouseX + "px";
    glow.style.top = AppState.mouseY + "px";

    AppState.animationFrameId = requestAnimationFrame(animateGlow);
}

////////// TERMINAL
function typeLine() {
    if (AppState.lineIndex >= TERMINAL_LINES.length) return;

    const currentLine = TERMINAL_LINES[AppState.lineIndex];

    if (AppState.charIndex < currentLine.length) {
        AppState.terminal.innerHTML += currentLine[AppState.charIndex];
        AppState.charIndex++;
        setTimeout(typeLine, 30);
    } else {
        AppState.terminal.innerHTML += "<br>";
        AppState.lineIndex++;
        AppState.charIndex = 0;
        setTimeout(typeLine, 400);
    }
}

////////// LOGS
function addLog() {
    const log = document.createElement("p");
    const randomIndex = Math.floor(Math.random() * LOGS.length);
    const now = new Date().toLocaleTimeString();

    log.textContent = `[${now}] ${LOGS[randomIndex]}`;

    AppState.logContainer.prepend(log);

    if (AppState.logContainer.children.length > 6) {
        AppState.logContainer.removeChild(AppState.logContainer.lastChild);
    }
}

////////// NETWORK DOTS
function createDot() {
    const dot = document.createElement("div");
    dot.classList.add("network-dot");

    dot.style.left = Math.random() * window.innerWidth + "px";

    document.body.appendChild(dot);

    setTimeout(() => dot.remove(), 5000);
}

////////// FADE IN
function initFadeIn() {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    });

    elements.forEach(el => observer.observe(el));
}