/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FINALE, C8 GEINTEGREERD)
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

// 🔑 ESSENTIEEL: FIELD_MAP moet bovenaan staan voor gebruik in handleCellClick
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
//   CORE FUNCTIES (NU ALLEMAAL AANWEZIG)
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
        // Celklik stuurt nu de index (nummer) naar Axioma Unlock
        cell.onclick = () => handleAxiomaUnlock(i); 
        grid.appendChild(cell);
    }
}

// 🔑 C8 DATAKOPPELING
function handleCellClick(i) {
    if (!isFieldActive) {
        logMessage("SYSTEM", "Veld is GELOCKT. Gebruik canonieke code.");
        return;
    }

    // C8: Haal data op
    const cluster = FIELD_MAP[i]?.cluster || "Onbekend";
    const file = FIELD_MAP[i]?.file || "readme/UNKNOWN.md";
    
    // Output naar Synapse
    const synapse = document.getElementById("synapse-content");
    
    if (synapse) {
        logMessage(cluster, `Activatie Cel ${i} (Query gestart).`);
        synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>Data Pad: <code>${file}</code>`;
    } else {
        // Dit vangt de fout op dat de Synapse ontbreekt in de HTML
        logMessage("SYSTEM", "Synapse element (#synapse-content) ontbreekt in DOM.");
    }
}

function updateMorphicView() {
    const grid = document.getElementById("grid");
    const morph = document.getElementById("morphic-view");
    if (!grid || !morph) return logMessage("SYSTEM", "Morphic DOM ontbreekt.");
    const active = morphicState.morphic_status === "HYBRID_NODES";
    
    grid.classList.toggle("hidden", active);
    morph.classList.toggle("hidden", !active);

    if (active) morph.innerHTML = SVG_GRID_37;
    else morph.innerHTML = "";
}


// ----------------------
//   AXIOMA INPUT (FINALE & STABIEL)
// ----------------------
function handleAxiomaUnlock(rawInput) {
    
    // Als input een nummer is (van celklik), stuur naar C8
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
          morphicState.morphic_status === "BASE_STATIC" ?
          "HYBRID_NODES" : "BASE_STATIC";
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
