/* ----------------------------------------------------------
   AiCelium Portal Engine v2.4.3 (FINALE, C8 DATAKOPPELING)
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

function updateCoreStatus(status) { /* ... */ }
function logMessage(source, message) { /* ... */ }
function renderGrid() { /* ... */ }
function updateMorphicView() { /* ... */ }


// 🔑 C8 DATAKOPPELING (Vervangt de STUB)
function handleCellClick(i) {
    if (!isFieldActive) {
        logMessage("SYSTEM", "Veld is GELOCKT. Gebruik canonieke code.");
        return;
    }

    // 🔑 Gebruik FIELD_MAP om de data op te halen (inclusief fallback)
    const cluster = FIELD_MAP[i]?.cluster || "Onbekend";
    const file = FIELD_MAP[i]?.file || "readme/UNKNOWN.md";
    
    // We gaan schrijven naar de Synapse. Dit element zit NIET in de HTML-code die u stuurde,
    // maar we gaan uit van het element met ID 'synapse-content' in de <aside> sectie.
    const synapse = document.getElementById("synapse-content");
    
    if (synapse) {
        logMessage(cluster, `Activatie Cel ${i} (Query gestart).`);
        synapse.innerHTML = `Active Query: <strong>${cluster} - Cel ${i}</strong><br>Data Pad: <code>${file}</code>`;
    } else {
        logMessage("SYSTEM", "Synapse element (#synapse-content) ontbreekt in DOM.");
    }
}


// ----------------------
//   AXIOMA INPUT (FINALE & STABIEL)
// ----------------------
function handleAxiomaUnlock(rawInput) { /* ... */ }

// ----------------------
//   INIT ON LOAD (SYNCHROON HERSTEL)
// ----------------------
document.addEventListener("DOMContentLoaded", () => { /* ... */ });
