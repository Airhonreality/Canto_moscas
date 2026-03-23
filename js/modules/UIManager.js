/**
 * UI MANAGER: El Escenario
 * Controla la interfaz visual del experimento.
 */
export class UIManager {
    constructor(overlayId, startBtnId, loaderId, logger) {
        this.overlay = document.getElementById(overlayId);
        this.startBtn = document.getElementById(startBtnId);
        this.loader = document.getElementById(loaderId);
        this.logger = logger;
        this.logger.info("UI Manager Inicializado.");

        if (!this.overlay) {
            this.logger.error("Overlay Element no encontrado en el DOM.");
        }
    }

    readyToStart() {
        this.logger.info("Interfaz Habilitada para el Usuario.");
        if (this.loader) this.loader.style.display = 'none';
        if (this.startBtn) this.startBtn.style.display = 'block';
    }

    closeOverlay() {
        this.logger.info("Cerrando Capa de Control Visual.");
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
                this.logger.info("Entorno de AR totalmente visible.");
            }, 600);
        }
    }

    showError(msg) {
        this.logger.error("UI Error: " + msg);
        if (this.startBtn) this.startBtn.style.display = 'none';
    }
}
