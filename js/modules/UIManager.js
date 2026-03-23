/**
 * UI MANAGER: El Escenario (SPA)
 */
export class UIManager {
    constructor(navLayerId, backBtnId, loaderId, logger) {
        this.navLayer = document.getElementById(navLayerId);
        this.backBtn = document.getElementById(backBtnId);
        this.loader = document.getElementById(loaderId);
        this.scanHint = document.getElementById('scan-hint');
        this.btnGroup = document.getElementById('btn-group-main');
        
        this.logger = logger;
        this.logger.info("UI Manager Inicializado.");
    }

    readyToStart() {
        if (this.loader) this.loader.style.display = 'none';
        if (this.btnGroup) this.btnGroup.style.display = 'flex';
        this.logger.info("Interfaz Lista para el usuario.");
    }

    // Cambiar entre vistas internas (Libro <-> Autores)
    showView(viewId) {
        const views = document.querySelectorAll('.view');
        views.forEach(v => v.classList.remove('active'));
        const activeView = document.getElementById(viewId);
        if (activeView) activeView.classList.add('active');
        this.logger.info(`Navegación: Vista ${viewId} cargada.`);
    }

    // Cambiar entre Modo AR y Modo Menú
    setARMode(active) {
        if (active) {
            this.navLayer.style.opacity = '0';
            setTimeout(() => {
                this.navLayer.style.display = 'none';
                this.backBtn.style.display = 'block';
                this.scanHint.style.display = 'block';
                this.logger.info("Modo Cámara Activo.");
            }, 800);
        } else {
            this.navLayer.style.display = 'flex';
            setTimeout(() => {
                this.navLayer.style.opacity = '1';
                this.backBtn.style.display = 'none';
                this.scanHint.style.display = 'none';
                this.logger.info("Modo Menú Activo.");
            }, 50);
        }
    }

    showError(msg) {
        this.logger.error("UI Error: " + msg);
        if (this.btnGroup) this.btnGroup.style.display = 'none';
    }
}
