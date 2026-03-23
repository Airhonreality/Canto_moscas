/**
 * UI MANAGER: El Escenario
 * Controla la interfaz visual del experimento.
 */
export class UIManager {
    constructor(overlayId, startBtnId, loaderId, logger) {
        this.overlay = document.getElementById(overlayId);
        this.startBtn = document.getElementById(startBtnId);
        this.loader = document.getElementById(loaderId);
        this.bookTitle = document.getElementById('book-title');
        this.logger = logger;
        this.logger.info("UI Manager Inicializado.");
    }

    readyToStart() {
        this.logger.info("Interfaz Habilitada para el Usuario.");
        if (this.loader) this.loader.style.display = 'none';
        if (this.startBtn) this.startBtn.style.display = 'block';
        if (this.bookTitle) this.bookTitle.style.display = 'block';
    }

    closeOverlay() {
        this.logger.info("Iniciando Lectura Aumentada...");
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
                this.logger.info("Visión AR activa.");
            }, 800);
        }
    }

    showError(msg) {
        this.logger.error("UI Error: " + msg);
        if (this.startBtn) this.startBtn.style.display = 'none';
    }
}
