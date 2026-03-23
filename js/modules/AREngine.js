/**
 * AR ENGINE: El Ojo
 * Gestiona la comunicación con MindAR en el Scene.
 */
export class AREngine {
    constructor(sceneId, targetId, logger) {
        this.sceneEl = document.getElementById(sceneId);
        this.targetEl = document.getElementById(targetId);
        this.logger = logger;
        this.onReadyCallback = null;
        this.onFoundCallback = null;
        this.onLostCallback = null;

        this.initialized = false;
        this.logger.info("AR Engine Inicializado.");

        if (!this.sceneEl) {
            this.logger.error("Scene Element no encontrado en el DOM.");
            return;
        }

        // 1. Escuchar Evento Ready de MindAR
        this.sceneEl.addEventListener('ready', () => {
            this.logger.info("MindAR Evento: READY emitido por sistema.");
            this._triggerReady();
        });

        // 2. Poll Determinístico de Sistema (por si falla el evento)
        this.pollTimer = setInterval(() => {
            const system = this.sceneEl.systems['mindar-image-system'];
            if (system && system.initialized) {
                this.logger.info("Axioma: Sistema MindAR verificado por sondeo.");
                this._triggerReady();
            }
        }, 1000);

        // 3. Registrar Eventos de Rastreo
        this.targetEl.addEventListener("targetFound", () => {
            this.logger.info("Axioma: Target de la Mosca Localizado.");
            if (this.onFoundCallback) this.onFoundCallback();
        });

        this.targetEl.addEventListener("targetLost", () => {
            this.logger.info("Axioma: Target de la Mosca Perdido.");
            if (this.onLostCallback) this.onLostCallback();
        });

        // Manejo de Cámara
        this.sceneEl.addEventListener("arError", (e) => {
            this.logger.error(`Error AR Crítico: ${e.detail.error}`);
        });

        this.logger.info("Esperando inicialización de MindAR...");
    }

    _triggerReady() {
        if (this.initialized) return;
        this.initialized = true;
        clearInterval(this.pollTimer);
        this.logger.info("Motor AR en Óptimo Estado para Iniciar.");
        if (this.onReadyCallback) this.onReadyCallback();
    }

    start() {
        this.logger.info("Iniciando Transmisión de Hardware (Cámara).");
        try {
            const system = this.sceneEl.systems['mindar-image-system'];
            system.start();
            this.logger.info("Cámara Iniciada Satisfactoriamente.");
        } catch (e) {
            this.logger.error("Fallo al arrancar Cámara: " + e.message);
        }
    }
}
