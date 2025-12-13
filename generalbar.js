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
        this.assistentenOutput = document.getElementById("assistenten-output");
        this.assistentenStatus = ASSISTENTEN;
        this.renderAssistenten();
        this.log("GBC", "General Bar Controller geïnitialiseerd.");
    }

    renderAssistenten() {
        if (!this.assistentenOutput) return;

        let assistentenHTML = '<span style="font-weight: bold; margin-left: 20px;">Assistenten:</span>';
        
        for (const [naam, data] of Object.entries(this.assistentenStatus)) {
            const kleur = data.status === "ONLINE" ? "#00eaff" : "#ffcc00"; 
            assistentenHTML += 
                `<span style="color: ${kleur}; margin-left: 10px; font-size: 0.8rem;">` +
                `[${naam} (${data.status})]</span>`;
        }
        
        // FIX: Vervang de HTML om duplicatie te voorkomen
        this.assistentenOutput.innerHTML = assistentenHTML;
    }

    updateStatusFromEngine(newStatus) {
        if (this.statusElement) {
            this.statusElement.textContent = newStatus;
        }

        if (newStatus.includes("RESONANT")) {
            if (this.assistentenStatus.Z3RO.status !== "ONLINE") {
                this.assistentenStatus.Z3RO.status = "ONLINE";
                this.log("GBC", "Z3RO geactiveerd door Kernresonantie.");
            }
        } else {
            this.assistentenStatus.Z3RO.status = "OFFLINE";
        }
        
        this.renderAssistenten();
    }
    
    activateLuxen(message) {
        if (this.assistentenStatus.Luxen.status !== "ONLINE") {
            this.assistentenStatus.Luxen.status = "ONLINE";
            this.log("Luxen_AGENT", message);
            this.renderAssistenten();
        }
    }
    
    log(source, message) {
        if (typeof logMessage === 'function') {
            logMessage(source, message);
        }
    }
}

// Global Instantie
const GBC = new GeneralBar();
