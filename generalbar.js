// --- Binnen engine.js, de handleAxiomaUnlock functie ---

    // PULS: morph
    if (pulse === "morph" && isFieldActive) {
        morphicState.morphic_status =
          morphicState.morphic_status === "BASE_STATIC" ?
          "HYBRID_NODES" : "BASE_STATIC";
        updateMorphicView();
        logMessage("LUMIN_AGENT", `State: ${morphicState.morphic_status}`);
        
        // 🔑 LUXEN ACTIVATIE & BERICHT (moet in engine.js)
        if (typeof GBC !== 'undefined' && GBC.activateLuxen) {
            GBC.activateLuxen("Welkom in de Morphic Layer. Hoe kan ik u begeleiden?");
        }
        return;
    }
// ...
