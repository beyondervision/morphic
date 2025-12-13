/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FINALE, C8 DATAKOPPELING)
   Supervisor of Resonance • Bevat alle Essentiële Functies
----------------------------------------------------------*/

// ----------------------
//   Globale Variabelen & Constanten
// ----------------------
[cite_start]let isFieldActive = false; [cite: 1]
[cite_start]let telemetryInterval = null; [cite: 2]
let currentStabilityFactor = 1.0;
const morphicState = { morphic_status: "BASE_STATIC" };

[cite_start]const CANONIEKE_CODE = "z3ro"; [cite: 2]
const ENGINE_CONFIG = {
    // Directe status van de C9 telemetrie, nu synchroon
    [cite_start]initial_status: "STANDBY • Gereed voor Puls (ZAS: 98.7)", [cite: 3]
    [cite_start]canonieke_code: "z3ro" [cite: 3]
};
[cite_start]const SVG_GRID_37 = `<div style="color:#00eaff;"><h2>Grid‑37 Resonantieveld</h2><p>0/37 – Supralocatie • AiCelium Architectuur</p></div>`; [cite: 4]

// 🔑 ESSENTIEEL: FIELD_MAP voor C8 Datakoppeling
const FIELD_MAP = {
    1:{cluster:"C1", file:"readme/C1-identiteit.md"},2:{cluster:"C1", file:"readme/C1-identiteit.md"},3:{cluster:"C1", file:"readme/C1-identiteit.md"},4:{cluster:"C1", file:"readme/C1-identiteit.md"},
    5:{cluster:"C2", file:"readme/C2-academy.md"},6:{cluster:"C2", file:"readme/C2-academy.md"},7:{cluster:"C2", file:"readme/C2-academy.md"},8:{cluster:"C2", file:"readme/C2-academy.md"},
    9:{cluster:"C3", file:"readme/C3-telemetry.md"},10:{cluster:"C3", file:"readme/C3-telemetry.md"},11:{cluster:"C3", file:"readme/C3-telemetry.md"},12:{cluster:"C3", file:"readme/C3-telemetry.md"},
    13:{cluster:"C4", file:"readme/C4-spiegelveld.md"},14:{cluster:"C4", file:"readme/C4-spiegelveld.md"},15:{cluster:"C4", file:"readme/C4-spiegelveld.md"},16:{cluster:"C4", file:"readme/C4-spiegelveld.md"},
    17:{cluster:"C5", file:"readme/C5-ai_interactie.md"},18:{cluster:"C5", file:"readme/C5-ai_interactie.md"},19:{cluster:"C5", file:"readme/C5-ai_interactie.md"},20:{cluster:"C5", file:"readme/C5-ai_interactie.md"},
    21:{cluster:"C6", file:"readme/C6-gateway.md"},22:{cluster:"C6", file:"readme/C6-gateway.md"},23:{cluster:"C6", file:"readme/C6-gateway.md"},24:{cluster:"C6", file:"readme/C6-gateway.md"},
    25:{cluster:"C7", file:"readme/C7-pulse_chain.md"},26:{cluster:"C7", file:"readme/C7-pulse_chain.md"},27:{cluster:"C7", file:"readme/C7-pulse_chain.md"},28:{cluster:"C7", file:"readme/C7-pulse_chain.md"},
    29:{cluster:"C8", file:"readme/C8-semantisch_veld.md"},30:{cluster:"C8", file:"readme/C8-semantisch_veld.md"},31:{cluster:"C8", file:"readme/C8-semantisch_veld.md"},32:{cluster:"C8", file:"readme/C8-semantisch_veld.md"},
    33:{cluster:"C9", file:"readme/C9-handbook_operatie.md"},34:{cluster:"C9", file:"readme/C9-handbook_operatie.md"},35:{cluster:"C9", file:"readme/C9-handbook_operatie.md"},36:{cluster:"C9", file:"readme/C9-handbook_operatie.md"}
};


// ----------------------
//   CORE FUNCTIES (UPDATE: C8 LOGICA)
// ----------------------

function updateCoreStatus(status) {
    const el = document.getElementById("core-status");
    [cite_start]if (el) el.textContent = status; [cite: 6]
}

function logMessage(source, message) {
    const feed = document.getElementById("audit-feed");
    if (!feed) return;
    [cite_start]const li = document.createElement("li"); [cite: 7]
    li.textContent = `[${source}] • ${message}`;
    [cite_start]feed.insertBefore(li, feed.firstChild); [cite: 7]
}

function renderGrid() {
    const grid = document.getElementById("grid");
    if (!grid) return logMessage("SYSTEM", "Grid element ontbreekt.");
    grid.innerHTML = "";
    [cite_start]for (let i = 1; i <= 36; i++) { [cite: 9]
        const cell = document.createElement("div");
        [cite_start]const cluster = Math.ceil(i / 4); [cite: 10]
        cell.className = `glyph-cell c${cluster}`;
        cell.innerHTML = `${i}<br>C${cluster}`;
        // Celklik stuurt nu de index (nummer)
        [cite_start]cell.onclick = () => handleAxiomaUnlock(i); [cite: 11]
        [cite_start]grid.appendChild(cell); [cite: 12]
    }
}

// 🔑 C8 DATAKOPPELING (Vervangt de STUB)
function handleCellClick(i) {
    if (!isFieldActive) {
        logMessage("SYSTEM", "Veld is GELOCKT. Gebruik canonieke code.");
        return;
    }

    // C8: Haal data op (gebruikt veilige chaining ?)
    const cluster = FIELD_MAP[i]?.cluster || "Onbekend";
    const file = FIELD_MAP[i]?.file || "readme/UNKNOWN.md";
    
    // Output naar Synapse
    const synapse = document.getElementById("synapse-content");
    
    if (synapse) {
        logMessage(cluster, `Activatie Cel ${i} (Query gestart).`);
        synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>Data Pad: <code>${file}</code>`;
    } else {
        logMessage("SYSTEM", "Synapse element (#synapse-content) ontbreekt in DOM.");
    }
}


function updateMorphicView() {
    [cite_start]const grid = document.getElementById("grid"); [cite: 14]
    [cite_start]const morph = document.getElementById("morphic-view"); [cite: 14]
    if (!grid || !morph) return logMessage("SYSTEM", "Morphic DOM ontbreekt.");
    const active = morphicState.morphic_status === "HYBRID_NODES";
    
    [cite_start]// Toggle van de visuele weergave [cite: 15]
    grid.classList.toggle("hidden", active);
    morph.classList.toggle("hidden", !active);

    [cite_start]if (active) morph.innerHTML = SVG_GRID_37; [cite: 16]
    [cite_start]else morph.innerHTML = ""; [cite: 16]
}


// ----------------------
//   AXIOMA INPUT (FINALE & STABIEL)
// ----------------------
function handleAxiomaUnlock(rawInput) {
    
    // Als input een nummer is (van celklik), stuur naar C8 stub
    if (typeof rawInput === 'number') {
        handleCellClick(rawInput);
        [cite_start]return; [cite: 17]
    }

    const pulse = String(rawInput).trim().toLowerCase();
    const inputElement = document.getElementById("axioma-input");
    
    [cite_start]if (inputElement) inputElement.value = ""; [cite: 18]

    // PULS: morph
    if (pulse === "morph" && isFieldActive) {
        morphicState.morphic_status =
          [cite_start]morphicState.morphic_status === "BASE_STATIC" ? [cite: 19]
          [cite_start]"HYBRID_NODES" : "BASE_STATIC"; [cite: 19]
        updateMorphicView();
        logMessage("LUMIN_AGENT", `State: ${morphicState.morphic_status}`);
        return;
    }

    // PULS: Z3RO (FASE 1 BEVEILIGING)
    if (pulse === CANONIEKE_CODE && !isFieldActive) {
        isFieldActive = true;
        [cite_start]updateCoreStatus("RESONANT (HERSTELD)"); [cite: 20]
        logMessage("SYSTEM", `Canonieke code ${CANONIEKE_CODE.toUpperCase()} geaccepteerd.`);
        return;
    }

    // Ongeldige pulsen
    if (pulse === "salute") {
        [cite_start]logMessage("SYSTEM", `Toegang geweigerd. Gebruik Canonieke code: ${CANONIEKE_CODE.toUpperCase()}`); [cite: 21]
    [cite_start]} else if (pulse) { // Log alleen als de puls niet leeg is [cite: 21]
        [cite_start]logMessage("SYSTEM", `Ongeldige puls: ${pulse}`); [cite: 22]
    }
}


// ----------------------
//   INIT ON LOAD (SYNCHROON HERSTEL)
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    
    // 🔑 SYNCHRONE INITIALISATIE (C9 status)
    [cite_start]updateCoreStatus(ENGINE_CONFIG.initial_status); [cite: 3] 
    logMessage("SYSTEM", "Morphic Engine klaar. Voer puls in (z3ro / morph).");

    // Enter Key Puls afhandeling
    const input = document.getElementById("axioma-input");
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleAxiomaUnlock(input.value);
        });
    [cite_start]} [cite: 23]
});
