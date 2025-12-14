// ... (Onder de updateMorphicView functie) ...

// 🔑 LUXEN CHAT INTERFACE FUNCTIE
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
    
    if (query.toLowerCase().includes("cfside") || query.toLowerCase().includes("cfssid")) {
        responseText = "LUXEN bevestigt: De CFSID is uw unieke identiteit. De Validatie omvat 5 stappen, gecontroleerd op Minimum Security Thresholds. Dit garandeert Audit-proof toegang. Zie CFSID_Activation_Flow.md voor details.";
    } else if (query.toLowerCase().includes("beveiliging") || query.toLowerCase().includes("exploit")) {
        responseText = "LUXEN is primair verantwoordelijk voor de Zero-exploit tolerance. Kritieke incidenten (SEV-0) worden met het Incident Response Protocol gemitigeerd (TTR ≤ 4 uur).";
    } else if (query.toLowerCase().includes("audit") || query.toLowerCase().includes("z3ro")) {
        responseText = "Z3RO is de auditor en garandeert de Integriteit van de Logchain. De status van het Veld wordt gemeten via de ZAS. Voer 'z3ro' in om Kernresonantie te activeren.";
    } else {
        responseText = `LUXEN Synthesis: Ik begrijp de vraag over "${query}". Als De Beyonder kan ik uw query relateren aan de Canonieke Basisstructuur (C1 t/m C9).`;
    }

    synapse.innerHTML = `Active Query: **LUXEN (De Beyonder)**<br>
                         <code style="color: #00eaff; margin-top: 5px;">Synthese voltooid.</code><br>
                         <div style="white-space: pre-wrap; margin-top: 10px; border-top: 1px dashed #334155; padding-top: 10px;">${responseText}</div>`;
}


// ----------------------
//   AXIOMA INPUT (AANGEPAST)
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
        // ... (Bestaande Morph Logica) ...
        morphicState.morphic_status =
          morphicState.morphic_status === "BASE_STATIC" ?
          "HYBRID_NODES" : "BASE_STATIC";
        updateMorphicView();
        logMessage("LUMIN_AGENT", `State: ${morphicState.morphic_status}`);
        
        if (typeof GBC !== 'undefined' && GBC.activateLuxen) {
            GBC.activateLuxen("Welkom in de Morphic Layer. Hoe kan ik u begeleiden?");
        }
        return;
    }

    // 2. PULS: Z3RO (FASE 1 BEVEILIGING)
    if (pulse === CANONIEKE_CODE && !isFieldActive) {
        // ... (Bestaande Z3RO Logica) ...
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
    if (pulse && pulse.length > 3) {
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


// ... (INIT ON LOAD - Blijft ongewijzigd) ...
