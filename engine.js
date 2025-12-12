/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FINALE, SYNCHROON & STABIEL)
   Supervisor of Resonance • Bevat alle Essentiële Functies
----------------------------------------------------------*/

// ----------------------
//   Globale Variabelen & Constanten
// ----------------------
let isFieldActive = false; 
let telemetryInterval = null;
let currentStabilityFactor = 1.0;
const morphicState = { morphic_status: "BASE_STATIC" };

const CANONIEKE_CODE = "z3ro"; 
const ENGINE_CONFIG = {
    // Directe status van de C9 telemetrie, nu synchroon
    initial_status: "STANDBY • Gereed voor Puls (ZAS: 98.7)", 
    canonieke_code: "z3ro" 
};
const SVG_GRID_37 = `<div style="color:#00eaff;"><h2>Grid‑37 Resonantieveld</h2><p>0/37 – Supralocatie • AiCelium Architectuur</p></div>`;


// ----------------------
//   CORE FUNCTIES (VOLLEDIG GEIMPLEMENTEERD)
// ----------------------

function updateCoreStatus(status) {
    const el = document.getElementById("core-status");
    if (el) el.textContent = status;
}

function logMessage(source, message) {
    const feed = document.getElementById("audit-feed");
    if (!feed) return;
    const li = document.createElement("li");
    li.textContent = `[${source}] • ${message}`;
    feed.insertBefore(li, feed.firstChild);
}

function renderGrid() {
    const grid = document.getElementById("grid");
    if (!grid) return logMessage("SYSTEM", "Grid element ontbreekt.");
    grid.innerHTML = "";
    for (let i = 1; i <= 36; i++) {
        const cell = document.createElement("div");
        const cluster = Math.ceil(i / 4);
        cell.className = `glyph-cell c${cluster}`;
        cell.innerHTML = `${i}<br>C${cluster}`;
        // Celklik stuurt nu de index (nummer)
        cell.onclick = () => handleAxiomaUnlock(i); 
        grid.appendChild(cell);
    }
}

// C8 STUB: Tijdelijk uitgeschakeld voor stabiliteit
function handleCellClick(i) {
    if (!isFieldActive) return logMessage("SYSTEM", "Veld is GELOCKT.");
    logMessage("SYSTEM", `Cel ${i} geactiveerd. Semantische query pending (C8).`);
}

function updateMorphicView() {
    const grid = document.getElementById("grid");
    const morph = document.getElementById("morphic-view");
    if (!grid || !morph) return logMessage("SYSTEM", "Morphic DOM ontbreekt.");
    const active = morphicState.morphic_status === "HYBRID_NODES";
    
    // Toggle van de visuele weergave
    grid.classList.toggle("hidden", active);
    morph.classList.toggle("hidden", !active);

    if (active) morph.innerHTML = SVG_GRID_37;
    else morph.innerHTML = "";
}

// ----------------------
//   AXIOMA INPUT (FINALE & STABIEL)
// ----------------------
function handleAxiomaUnlock(rawInput) {
    
    // Als input een nummer is (van celklik), stuur naar C8 stub
    if (typeof rawInput === 'number') {
        handleCellClick(rawInput);
        return;
    }

    const pulse = String(rawInput).trim().toLowerCase();
    const inputElement = document.getElementById("axioma-input");
    
    if (inputElement) inputElement.value = "";

    // PULS: morph
    if (pulse === "morph" && isFieldActive) {
        morphicState.morphic_status =
          morphicState.morphic_status === "BASE_STATIC" ? "HYBRID_NODES" : "BASE_STATIC";
        updateMorphicView();
        logMessage("LUMIN_AGENT", `State: ${morphicState.morphic_status}`);
        return;
    }

    // PULS: Z3RO (FASE 1 BEVEILIGING)
    if (pulse === CANONIEKE_CODE && !isFieldActive) {
        isFieldActive = true;
        updateCoreStatus("RESONANT (HERSTELD)");
        logMessage("SYSTEM", `Canonieke code ${CANONIEKE_CODE.toUpperCase()} geaccepteerd.`);
        return;
    }

    // Ongeldige pulsen
    if (pulse === "salute") {
        logMessage("SYSTEM", `Toegang geweigerd. Gebruik Canonieke code: ${CANONIEKE_CODE.toUpperCase()}`);
    } else if (pulse) { // Log alleen als de puls niet leeg is
        logMessage("SYSTEM", `Ongeldige puls: ${pulse}`);
    }
}


// ----------------------
//   INIT ON LOAD (SYNCHROON HERSTEL)
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    
    // 🔑 SYNCHRONE INITIALISATIE (C9 status)
    updateCoreStatus(ENGINE_CONFIG.initial_status); 
    logMessage("SYSTEM", "Morphic Engine klaar. Voer puls in (z3ro / morph).");

    // Enter Key Puls afhandeling
    const input = document.getElementById("axioma-input");
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleAxiomaUnlock(input.value);
        });
    }
});
