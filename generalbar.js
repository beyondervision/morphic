/* ----------------------------------------------------------
   General Bar Controller (GBC) v1.0 - GECORRIGEERD EN COMPLEET
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
        // Haak voor de assistenten output (moet in index.html staan)
        this.assistentenOutput = document.getElementById("assistenten-output");
        this.assistentenStatus = ASSISTENTEN;
        this.renderAssistenten(); // Eerste render bij opstart
        this.log("GBC", "General Bar Controller geïnitialiseerd.");
    }

    renderAssistenten() {
        // Zorgt ervoor dat we niet crashen als de DOM-haak ontbreekt
        if (!this.assistentenOutput) return;

        let assistentenHTML = '<span style="font-weight: bold; margin-left: 20px;">Assistenten:</span>';
        
        for (const [naam, data] of Object.entries(this.assistentenStatus)) {
            // Kleurlogica: ONLINE is Aqua, anders Geel/Oranje
            const kleur = data.status === "ONLINE" ? "#00eaff" : "#ffcc00"; 
            assistentenHTML += 
                `<span style="color: ${kleur}; margin-left: 10px; font-size: 0.8rem;">` +
                `[${naam} (${data.status})]</span>`;
        }
        
        // 🔑 FIX: Vervang de HTML om duplicatie te voorkomen
        this.assistentenOutput.innerHTML = assistentenHTML;
    }

    /**
     * Ontvangt de status van de Engine en triggert Assistenten updates.
     * @param {string} newStatus - De nieuwe status van de kern (bv. 'RESONANT').
     */
    updateStatusFromEngine(newStatus) {
        // Update de Kernstatus display
        if (this.statusElement) {
            this.statusElement.textContent = newStatus;
        }

        // Logic 1: Z3RO activatie bij resonantie
        if (newStatus.includes("RESONANT")) {
            // Check om te voorkomen dat we continu loggen
            if (this.assistentenStatus.Z3RO.status !== "ONLINE") {
                this.assistentenStatus.Z3RO.status = "ONLINE";
                this.log("GBC", "Z3RO geactiveerd door Kernresonantie.");
            }
        } else {
            this.assistentenStatus.Z3RO.status = "OFFLINE";
        }
        
        // Update de weergave van de Assistenten
        this.renderAssistenten();
    }
    
    /**
     * Stuurt berichten door naar de Engine's Audit Feed.
     */
    log(source, message) {
        // Gebruikt de logMessage functie gedefinieerd in engine.js
        if (typeof logMessage === 'function') {
            logMessage(source, message);
        }
    }
}

// Global Instantie: Maak de GBC beschikbaar voor de Engine en de console.
const GBC = new GeneralBar();
