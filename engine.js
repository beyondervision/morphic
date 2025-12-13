/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FINALE & COMPLEET)
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
    initial_status: "STANDBY • Gereed voor Puls (ZAS: 98.7)",
    canonieke_code: "z3ro"
};
const SVG_GRID_37 = `<div style="color:#00eaff;"><h2>Grid‑37 Resonantieveld</h2><p>0/37 – Supralocatie • AiCelium Architectuur</p></div>`;

// 🔑 ESSENTIEEL: FIELD_MAP (DEFINITIEF GESYNCHRONISEERD EN COMPLEET)
const FIELD_MAP = {
    1:{cluster:"C1", file:"readme/C1-identiteit.md"},2:{cluster:"C1", file:"readme/C1-identiteit.md"},3:{cluster:"C1", file:"readme/C1-identiteit.md"},4:{cluster:"C1", file:"readme/C1-identiteit.md"},
    5:{cluster:"C2", file:"readme/C2-academy.md"},6:{cluster:"C2", file:"readme/C2-academy.md"},7:{cluster:"C2", file:"readme/C2-academy.md"},8:{cluster:"C2", file:"readme/C2-academy.md"},
    9:{cluster:"C3", file:"readme/C3-telemetry.md"},10:{cluster:"C3", file:"readme/C3-telemetry.md"},11:{cluster:"C3", file:"readme/C3-telemetry.md"},12:{cluster:"C3", file:"readme/C3-telemetry.md"},
    13:{cluster:"C4", file:"readme/C4-debeyonder-com.md"},14:{cluster:"C4", file:"readme/C4-debeyonder-com.md"},15:{cluster:"C4", file:"readme/C4-debeyonder-com.md"},16:{cluster:"C4", file:"readme/C4-debeyonder-com.md"},
    17:{cluster:"C5", file:"readme/C5-debeyonder-ai.md"},18:{cluster:"C5", file:"readme/C5-debeyonder-ai.md"},19:{cluster:"C5", file:"readme/C5-debeyonder-ai.md"},20:{cluster:"C5", file:"readme/C5-debeyonder-ai.md"},
    21:{cluster:"C6", file:"readme/C6-portal-nodes.md"},22:{cluster:"C6", file:"readme/C6-portal-nodes.md"},23:{cluster:"C6", file:"readme/C6-portal-nodes.md"},24:{cluster:"C6", file:"readme/C6-portal-nodes.md"},
    25:{cluster:"C7", file:"readme/C7-audit-z3ro.md"},26:{cluster:"C7", file:"readme/C7-audit-z3ro.md"},27:{cluster:"C7", file:"readme/C7-audit-z3ro.md"},28:{cluster:"C7", file:"readme/C7-audit-z3ro.md"},
    29:{cluster:"C8", file:"readme/C8-alphabet-engine.md"},30:{cluster:"C8", file:"readme/C8-alphabet-engine.md"},31:{cluster:"C8", file:"readme/C8-alphabet-engine.md"},32:{cluster:"C8", file:"readme/C8-alphabet-engine.md"},
    33:{cluster:"C9", file:"readme/C9-handbook-operatie.md"},34:{cluster:"C9", file:"readme/C9-handbook-operatie.md"},35:{cluster:"C9", file:"readme/C9-handbook-operatie.md"},36:{cluster:"C9", file:"readme/C9-handbook-operatie.md"}
};


// ----------------------
//   CORE FUNCTIES (VOLLEDIG GEIMPLEMENTEERD)
// ----------------------

function updateCoreStatus(status) {
    // 🔑 Stuurt de status door naar de General Bar Controller (GBC) voor assistent updates
    if (typeof GBC !== 'undefined' && GBC.updateStatusFromEngine) {
        GBC.updateStatusFromEngine(status);
    } else {
        const el = document.getElementById("core-status");
        if (el) el.textContent = status;
    }
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
        cell.onclick = () => handleAxiomaUnlock(i); 
        grid.appendChild(cell);
    }
}

// 🔑 C8 DATAKOPPELING MET ASYNCHRONE FETCH (FINALE VERSIE)
async function handleCellClick(i) {
    if (!isFieldActive) {
        logMessage("SYSTEM", "Veld is GELOCKT. Gebruik canonieke code.");
        return;
    }

    const cluster = FIELD_MAP[i]?.cluster || "Onbekend";
    const file = FIELD_MAP[i]?.file || "readme/UNKNOWN.md";
    const synapse = document.getElementById("synapse-content");
    
    if (synapse) {
        logMessage(cluster, `Activatie Cel ${i}. Start FETCH van ${file}`);
        synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>Bezig met ophalen van data...`;

        try {
            const response = await fetch(file);
            
            if (!response.ok) {
                // Foutcode 404 is nu opgelost door de FIELD_MAP fix
                throw new Error(`Foutcode: ${response.status} - Controleer of ${file} bestaat op de server.`);
            }

            const content = await response.text();
            
            // Toon de content in de Synapse
            synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>
                                 <code style="color: #00eaff; display: block; margin-top: 5px;">${file} geladen</code><br>
                                 <div style="white-space: pre-wrap; margin-top: 10px; border-top: 1px dashed #334155; padding-top: 10px;">${content}</div>`;
            logMessage(cluster, `Content geladen (${file}).`);

        } catch (error) {
            synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>
                                 <code style="color: #ff3333; display: block; margin-top: 5px;">FETCH FOUT: Kan bestand ${file} niet ophalen.</code>`;
            logMessage("FALHA", `Fout bij ophalen content: ${error.message}`);
        }
    } else {
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
//   AXIOMA INPUT (COMPLEET)
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
        
        // 🔑 LUXEN ACTIVATIE & BERICHT
        if (typeof GBC !== 'undefined' && GBC.activateLuxen) {
            GBC.activateLuxen("Welkom in de Morphic Layer. Hoe kan ik u begeleiden?");
        }
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
//   INIT ON LOAD
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    
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
