/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FASE 4: MORPHIC & TELEMETRIE)
----------------------------------------------------------*/

let isFieldActive = false;
let telemetryInterval = null;
let morphicState = { morphic_status: "BASE_STATIC" };

const CANONIEKE_CODE = "z3ro"; [cite: 3]
const ENGINE_CONFIG = {
    initial_status: "STANDBY",
    canonieke_code: "z3ro"
};

const SVG_GRID_37 = `<div style="color:#00eaff;"><h2>Grid‑37 Resonantieveld</h2><p>0/37 – Supralocatie • AiCelium Architectuur</p></div>`; [cite: 4]

// --- CORE FUNCTIES ---
function updateCoreStatus(newStatus) {
    const el = document.getElementById("core-status");
    if (el) el.textContent = newStatus; [cite: 6, 7]
}

function logMessage(sender, message) {
    const feed = document.getElementById("audit-feed");
    if (!feed) return;
    const li = document.createElement("li");
    li.innerHTML = `[${sender}] • ${message}`; [cite: 9]
    feed.insertBefore(li, feed.firstChild); [cite: 10]
}

function renderGrid() {
    const grid = document.getElementById("grid");
    if (!grid) return; [cite: 11]
    grid.innerHTML = "";
    for (let i = 1; i <= 36; i++) { [cite: 12]
        const cell = document.createElement("div");
        const cluster = Math.ceil(i/4); [cite: 13]
        cell.className = `glyph-cell c${cluster}`;
        cell.innerHTML = `${i}<br>C${cluster}`; [cite: 15]
        cell.onclick = () => handleAxiomaUnlock(i);
        grid.appendChild(cell); [cite: 16]
    }
}

function fetchExternalStatus() {
    fetch('status.json')
        .then(response => response.json())
        .then(data => {
            updateCoreStatus(`STANDBY • Status: ${data.status} (${data.ZAS_score})`); [cite: 40]
            logMessage("C9_AUDIT", `Telemetrie geladen: ${data.last_check}`); [cite: 40]
        })
        .catch(err => {
            logMessage("SYSTEM", "status.json niet gevonden. Fallback actief.");
            updateCoreStatus(ENGINE_CONFIG.initial_status);
        });
}

function handleAxiomaUnlock(input) {
    if (typeof input === 'number') {
        logMessage("SYSTEM", `Cel ${input} geklikt. Query tijdelijk uit.`); [cite: 23, 24]
        return;
    }

    input = input.trim().toLowerCase(); [cite: 25]
    document.getElementById("axioma-input").value = '';

    if (input === CANONIEKE_CODE) {
        isFieldActive = true;
        updateCoreStatus("RESONANT (HERSTELD)"); [cite: 29]
        logMessage("SYSTEM", "Canonieke code Z3RO geaccepteerd.");
        return;
    }

    if (input === "morph" && isFieldActive) {
        morphicState.morphic_status = morphicState.morphic_status === "BASE_STATIC" ? "HYBRID_NODES" : "BASE_STATIC"; [cite: 25, 26, 27]
        const grid = document.getElementById("grid");
        const morph = document.getElementById("morphic-view");
        
        if (morphicState.morphic_status === "HYBRID_NODES") {
            grid.style.display = "none";
            morph.style.display = "block"; [cite: 20]
            morph.innerHTML = SVG_GRID_37; [cite: 21]
        } else {
            grid.style.display = "grid";
            morph.style.display = "none"; [cite: 22]
        }
        logMessage("LUMIN_AGENT", `State: ${morphicState.morphic_status}`); [cite: 28]
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderGrid(); [cite: 32]
    fetchExternalStatus();
    logMessage("SYSTEM", "Morphic Root Geladen.");
});