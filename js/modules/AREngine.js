/**
 * AR ENGINE: El Ojo (VERSIÓN DESPERTAR MANUAL)
 * Desbloquea el Deadlock del Ready.
 */
export class AREngine {
    constructor(sceneId, targetId, logger) {
        this.sceneEl = document.getElementById(sceneId);
        this.targetEl = document.getElementById(targetId);
        this.logger = logger;
        
        this.onHydratedCallback = null; // Escena cargada, lista para botón.
        this.onActiveCallback = null;   // Cámara abierta, tracking OK.
        this.onFoundCallback = null;
        this.onLostCallback = null;

        this.initialized = false;
        this.isActive = false;

        this.logger.info("AR Engine: Analizando Hidratación...");

        if (!this.sceneEl) {
            this.logger.error("Scene no encontrada.");
            return;
        }

        // 1. Interceptor de Workers (Para saber cuándo nace el cerebro)
        const OriginalWorker = window.Worker;
        window.Worker = function(scriptUrl) {
            console.log(`[DEBUG-WORKER] Creando hilo de visión: ${scriptUrl}`);
            window.App.logger.info(`Axioma: Hilo CV Creado: ${scriptUrl.substring(0, 20)}...`);
            return new OriginalWorker(scriptUrl);
        };

        // 2. Evento NATIVO de A-Frame (La escena ha cargado sus sistemas)
        this.sceneEl.addEventListener('loaded', () => {
            this.logger.info("A-Frame Scene: LOADED (Hidratación completa).");
            this._checkHydration();
        });

        // 3. Evento NATIVO de MindAR (La cámara y el tracking están listos)
        this.sceneEl.addEventListener('ready', () => {
            this.logger.info("MindAR Evento: READY (Cámara y Engine Activos).");
            this.isActive = true;
            if (this.onActiveCallback) this.onActiveCallback();
        });

        // 4. Polling de Fall-safe para la hidratación
        this.pollTimer = setInterval(() => {
            this._checkHydration();
        }, 1000);

        // 5. Rastreo de Targets
        this.targetEl.addEventListener("targetFound", () => {
            this.logger.info("Axioma: Target LOCALIZADO.");
            if (this.onFoundCallback) this.onFoundCallback();
        });

        this.targetEl.addEventListener("targetLost", () => {
            this.logger.info("Axioma: Target PERDIDO.");
            if (this.onLostCallback) this.onLostCallback();
        });

        // 6. Manejo de Errores
        this.sceneEl.addEventListener("arError", (e) => {
            this.logger.error(`Error AR Crítico: ${e.detail.error}`);
        });
    }

    _checkHydration() {
        if (this.initialized) return;
        const system = this.sceneEl.systems['mindar-image-system'];
        if (system) {
            this.initialized = true;
            clearInterval(this.pollTimer);
            this.logger.info("Axioma: Sistema Localizado y Hidratado.");
            if (this.onHydratedCallback) this.onHydratedCallback();
        }
    }

    start() {
        this.logger.info("Disparando Despertar Manual del Motor...");
        try {
            const system = this.sceneEl.systems['mindar-image-system'];
            system.start();
            this.logger.info("Motor MindAR: Despertado satisfactoriamente.");
        } catch (e) {
            this.logger.error(`Falla en system.start(): ${e.message}`);
        }
    }
}
