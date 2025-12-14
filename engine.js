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
let currentZAS = "Laden..."; // Nieuw: Hou ZAS-score bij

const CANONIEKE_CODE = "z3ro";
// ENGINE_CONFIG is nu initieel, de status wordt dynamisch overschreven
const ENGINE_CONFIG = {
    initial_status: "STANDBY • Initialisatie",
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
//   CORE FUNCTIES 
// ----------------------

function updateCoreStatus(status) {
    // Voeg de ZAS-score toe aan de statusbalk
    const fullStatus = `${status} (ZAS: ${currentZAS})`;
    
    // 🔑 Stuurt de status door naar de General Bar Controller (GBC) voor assistent updates
    if (typeof GBC !== 'undefined' && GBC.updateStatusFromEngine) {
        GBC.updateStatusFromEngine(fullStatus);
    } else {
        const el = document.getElementById("core-status");
        if (el) el.textContent = fullStatus;
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

// 🔑 Z3RO LIVE STATUS FETCH (HAALT status.json op)
async function fetchStatus() {
    try {
        const response = await fetch('status.json'); // Pad naar uw status.json
        if (!response.ok) {
            throw new Error(`Foutcode: ${response.status}`);
        }
        const data = await response.json();
        
        currentZAS = data.ZAS_score + "%";
        
        // Bepaal de status op basis van de ZAS (Conform MVS criterium: ZAS >= 95)
        let status;
        if (data.ZAS_score >= 95) {
            status = "STABLE • Veld compliant";
        } else if (data.ZAS_score >= 85) { // Sprint 2 Soft Criterium
            status = "WARNING • Resonantie verzwakt";
        } else {
            status = "CRITICAL • ZAS non-compliant";
        }

        updateCoreStatus(status);
        logMessage("Z3RO", `Telemetrie geladen. Status: ${data.status}, ZAS: ${currentZAS}`);

    } catch (error) {
        logMessage("FALHA", `Kan status.json niet ophalen/parsen: ${error.message}. Status ingesteld op OFFLINE.`);
        currentZAS = "N/A";
        updateCoreStatus("OFFLINE • Geen Z3RO Telemetrie");
    }
}


// 🔑 C8 DATAKOPPELING MET ASYNCHRONE FETCH
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


// 🔑 LUXEN CFSID ACTIVATION FLOW (Triggered door het Residency Formulier)
function startCFSIDActivation() {
    const luxenOnline = (typeof GBC !== 'undefined' && GBC.assistentenStatus.Luxen.status === "ONLINE");

    // Check 1: Veld is actief (Z3RO vereist)
    if (!isFieldActive) {
        logMessage("LUXEN_AGENT", "CFSID Aanvraag geweigerd. Veld is niet RESONANT. Voer 'z3ro' puls in.");
        return;
    }
    // Check 2: Luxen is actief (Beveiliging Mandaat)
    if (!luxenOnline) {
        logMessage("LUXEN_AGENT", "CFSID Aanvraag geweigerd. LUXEN is STANDBY (Security Mandaat). Voer 'morph' puls in.");
        return;
    }

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    
    if (!name || !email) {
        logMessage("LUXEN_AGENT", "Validatie FALHA: Naam en E-mail zijn verplicht.");
        return;
    }

    logMessage("LUXEN_AGENT", `CFSID Activatie gestart voor: ${name} (Rol: ${role})`);
    
    // Stap 1 & 2: Validatie van Aanvraag (AETRON & LUXEN)
    logMessage("AETRON", "Stap 1: Formele aanvraag ingediend. (Strategiecheck)");
    logMessage("LUXEN_AGENT", "Stap 2: Controle Minimum Security Thresholds...");

    // Simuleer een check op de Minimum Security Thresholds (moet >= 2 bewijsstukken hebben)
    const isValid = Math.random() > 0.1; // 90% kans op succes

    if (isValid) {
        // Stap 3 & 4: Uitgifte & Activatie
        logMessage("LUXEN_AGENT", "Stap 3: Identiteitsvalidatie GESLAAGD. Unieke CFSID + IST Token gegenereerd.");
        logMessage("Z3RO", "Stap 5: Logging. CFSID-Flow geregistreerd in hashchain.");
        logMessage("LUXEN_AGENT", "CFSID-Activatie: SUCCES. Gebruiker kan nu inloggen.");
        updateCoreStatus("RESONANT • CFSID Uitgegeven");

    } else {
        // Failure Flow (Audit van Mislukte Activatie)
        logMessage("LUXEN_AGENT", "Stap 2: Validatie FALHA. Identiteitsvalidatie of Token Validiteit faalt.");
        logMessage("Z3RO", "Fout in CFSID Flow. Reden gelogd naar /logs/activation/reject.log.");
        logMessage("LUXEN_AGENT", "CFSID-Activatie: AFGEWEZEN. Heractivatie vereist.");
    }
}


// 🔑 LUXEN CHAT INTERFACE FUNCTIE (Verwerkt natuurlijke taal)
function handleLuxenChat(query) {
    const synapse = document.getElementById("synapse-content");
    const luxenOnline = (typeof GBC !== 'undefined' && GBC.assistentenStatus.Luxen.status === "ONLINE");

    if (!synapse) return;
    
    logMessage("SYSTEM", `Query ontvangen: "${query}"`);

    if (!luxenOnline) {
        synapse.innerHTML = `Active Query: **LUXEN**<br>
                             <div style="color: #ffcc00; margin-top: 10px;"> LUXEN is STANDBY. Activeer de Morphic Layer met de puls 'morph' om te communiceren.</div>`;
        return;
    }

    // LUXEN is actief, genereer een contextueel antwoord
    logMessage("LUXEN_AGENT", "Bezig met Synthese van Canonieke Kennis...");
    
    let responseText = "";
    
    if (query.toLowerCase().includes("cfside") || query.toLowerCase().includes("cfssid") || query.toLowerCase().includes("aanmelden")) {
        responseText = "LUXEN bevestigt: De CFSID is uw unieke identiteit. De Validatie omvat 5 stappen, gecontroleerd op Minimum Security Thresholds. Gebruik het aanmeldformulier op deze pagina om de LUXEN Validatie te starten.";
    } else if (query.toLowerCase().includes("beveiliging") || query.toLowerCase().includes("exploit") || query.toLowerCase().includes("incident")) {
        responseText = "LUXEN is primair verantwoordelijk voor de Zero-exploit tolerance. Kritieke incidenten (SEV-0) worden met het Incident Response Protocol gemitigeerd (TTR ≤ 4 uur).";
    } else if (query.toLowerCase().includes("audit") || query.toLowerCase().includes("z3ro") || query.toLowerCase().includes("trace")) {
        responseText = `Z3RO is de auditor en garandeert de Integriteit van de Logchain. De status van het Veld wordt gemeten via de ZAS: ${currentZAS}. Voer 'z3ro' in om Kernresonantie te activeren.`;
    } else {
        responseText = `LUXEN Synthesis: Ik begrijp de vraag over "${query}". Als De Beyonder kan ik uw query relateren aan de Canonieke Basisstructuur (C1 t/m C9).`;
    }

    synapse.innerHTML = `Active Query: **LUXEN (De Beyonder)**<br>
                         <code style="color: #00eaff; margin-top: 5px;">Synthese voltooid.</code><br>
                         <div style="white-space: pre-wrap; margin-top: 10px; border-top: 1px dashed #334155; padding-top: 10px;">${responseText}</div>`;
}


// ----------------------
//   AXIOMA INPUT 
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

    // 1. PULS: morph
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

    // 2. PULS: Z3RO (FASE 1 BEVEILIGING)
    if (pulse === CANONIEKE_CODE && !isFieldActive) {
        isFieldActive = true;
        updateCoreStatus("RESONANT (HERSTELD)");
        logMessage("SYSTEM", `Canonieke code ${CANONIEKE_CODE.toUpperCase()} geaccepteerd.`);
        
        // Z3RO is nu ONLINE in de GBC
        if (typeof GBC !== 'undefined' && GBC.updateStatusFromEngine) {
            GBC.updateStatusFromEngine("RESONANT (HERSTELD)");
        }
        return;
    }
    
    // 3. Verwerk als LUXEN CHAT (natuurlijke taal)
    if (pulse && pulse.length > 3) { // Voorkom dat korte pulsen zoals 'c1' als chat worden gezien
        handleLuxenChat(pulse);
        return;
    }

    // 4. Ongeldige pulsen of te korte input
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
    
    // 🔑 Start Z3RO Status Fetch bij initialisatie
    fetchStatus(); 

    logMessage("SYSTEM", "Morphic Engine klaar. Voer puls in (z3ro / morph).");

    // Enter Key Puls afhandeling
    const input = document.getElementById("axioma-input");
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleAxiomaUnlock(input.value);
        });
    }
});
