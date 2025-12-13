/* ----------------------------------------------------------
   General Bar Controller (GBC) v1.0 - Assistent Modus
   Coördineert de Morphic Assistenten (Aetron, Z3RO, Luxen)
----------------------------------------------------------*/

const ASSISTENTEN = {
    Aetron: { role: "Logistiek", status: "STANDBY" },
    Z3RO: { role: "Kernresonantie", status: "OFFLINE" },
    Luxen: { role: "Synthese", status: "OFFLINE" }
};

class GeneralBar {
    constructor() {
        this.statusElement = document.getElementById("core-status");
        this.headerElement = document.getElementById("general-bar");
        this.assistentenStatus = ASSISTENTEN;
        this.renderAssistenten();
    }

    renderAssistenten() {
        // Zoek de juiste plek (bv. naast de Kernstatus) om de Assistenten te tonen
        if (!this.headerElement) return;

        let assistentenHTML = '<span style="font-weight: bold; margin-left: 20px;">Assistenten:</span>';
        
        for (const [naam, data] of Object.entries(this.assistentenStatus)) {
            const kleur = data.status === "STANDBY" ? "#00eaff" : "#ffcc00";
            assistentenHTML += 
                `<span style="color: ${kleur}; margin-left: 10px; font-size: 0.8rem;">` +
                `[${naam} (${data.status})]</span>`;
        }
        
        // Voeg de nieuwe HTML toe aan de General Bar
        this.headerElement.insertAdjacentHTML('beforeend', assistentenHTML);
        this.log("GBC", "Assistenten Geladen. Aetron is STANDBY.");
    }

    // 🔑 Methode om de Engine Status te ontvangen en de Assistenten te updaten
    updateStatusFromEngine(newStatus) {
        if (this.statusElement) {
            this.statusElement.textContent = newStatus;
        }

        // Simuleer een update van Z3RO bij resonantie
        if (newStatus.includes("RESONANT")) {
            this.assistentenStatus.Z3RO.status = "ONLINE";
            this.log("GBC", "Z3RO geactiveerd door Kernresonantie.");
        } else {
            this.assistentenStatus.Z3RO.status = "OFFLINE";
        }
        
        // Her-render de assistenten om de status te tonen
        this.renderAssistenten();
    }
    
    // Log berichten naar de Audit Feed (via de Engine functie, indien beschikbaar)
    log(source, message) {
        if (typeof logMessage === 'function') {
            logMessage(source, message);
        }
    }
}

// Global Instantie: Maak de GBC beschikbaar voor de Engine
const GBC = new GeneralBar();