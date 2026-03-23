/**
 * AR ENGINE: El Ojo (VERSIÓN DETERMINISTA)
 */
export class AREngine {
    constructor(sceneId, targetId, logger) {
        this.sceneEl = document.getElementById(sceneId);
        this.targetEl = document.getElementById(targetId);
        this.logger = logger;
        
        this.onActiveCallback = null;
        this.onFoundCallback = null;
        this.onLostCallback = null;

        this.initialized = false;
        this.isActive = false;

        this.logger.info("Motor AR en espera del usuario...");

        this.sceneEl.addEventListener('ready', () => {
            this.logger.info("Cámara y Tracking ACTIVOS!");
            this.isActive = true;
            if (this.onActiveCallback) this.onActiveCallback();
        });

        this.targetEl.addEventListener("targetFound", () => {
            if (this.onFoundCallback) this.onFoundCallback();
        });

        this.targetEl.addEventListener("targetLost", () => {
            if (this.onLostCallback) this.onLostCallback();
        });

        this.sceneEl.addEventListener("arError", (e) => {
            this.logger.error(`Error de Cámara: ${e.detail.error}`);
        });
    }

    start() {
        this.logger.info("Inyectando Cámara al Sistema...");
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) {
            system.start();
        } else {
            this.logger.error("Error: Sistema MindAR no hidratado en A-Frame.");
        }
    }

    stop() {
        this.logger.warn("Liberando Cámara...");
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) {
            system.stop();
            const video = document.querySelector('video');
            if (video) video.remove();
        }
        this.isActive = false;
    }
}
