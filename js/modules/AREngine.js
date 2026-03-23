/**
 * AR ENGINE: El Ojo (MODULAR & REUTILIZABLE)
 */
export class AREngine {
    constructor(sceneId, targetId, logger) {
        this.sceneEl = document.getElementById(sceneId);
        this.targetEl = document.getElementById(targetId);
        this.logger = logger;
        
        this.onHydratedCallback = null;
        this.onActiveCallback = null;
        this.onFoundCallback = null;
        this.onLostCallback = null;

        this.initialized = false;
        this.isActive = false;

        if (!this.sceneEl) return;

        this.sceneEl.addEventListener('loaded', () => {
            this._checkHydration();
        });

        this.sceneEl.addEventListener('ready', () => {
            this.logger.info("MindAR READY.");
            this.isActive = true;
            if (this.onActiveCallback) this.onActiveCallback();
        });

        this.pollTimer = setInterval(() => {
            this._checkHydration();
        }, 800);

        this.targetEl.addEventListener("targetFound", () => {
            if (this.onFoundCallback) this.onFoundCallback();
        });

        this.targetEl.addEventListener("targetLost", () => {
            if (this.onLostCallback) this.onLostCallback();
        });

        this.sceneEl.addEventListener("arError", (e) => {
            this.logger.error(`AR Error: ${e.detail.error}`);
        });
    }

    _checkHydration() {
        if (this.initialized) return;
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) {
            this.initialized = true;
            clearInterval(this.pollTimer);
            this.logger.info("AR Engine Hidratado.");
            if (this.onHydratedCallback) this.onHydratedCallback();
        }
    }

    start() {
        this.logger.info("Abriendo Cámara...");
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) system.start();
    }

    stop() {
        this.logger.warn("Cerrando Cámara y Liberando Recursos...");
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) {
            system.stop();
            // Limpiar manualmente el video feed si MindAR lo deja en el body
            const video = document.querySelector('video');
            if (video) video.remove();
        }
        this.isActive = false;
    }
}
