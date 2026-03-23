/**
 * AR ENGINE: El Ojo (VERSIÓN LABORATORIO NUCLEARES)
 * Auditoría profunda del ciclo de vida de MindAR.
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
        this.logger.info("Laboratorio AR: Iniciando Auditoría...");

        if (!this.sceneEl) {
            this.logger.error("Scene no encontrada.");
            return;
        }

        // 1. Interceptor de Workers (Detectar si se crea el hilo CV)
        const OriginalWorker = window.Worker;
        window.Worker = function(scriptUrl) {
            console.log(`[DEBUG-WORKER] Creando hilo de visión: ${scriptUrl}`);
            window.App.logger.info(`Hilo CV Creado: ${scriptUrl.substring(0, 30)}...`);
            return new OriginalWorker(scriptUrl);
        };

        // 2. Auditoría de Scene y Sistemas
        this.sceneEl.addEventListener('loaded', () => {
            this.logger.info("A-Frame Scene: LOADED (Hidratación completa).");
            this._auditSystems();
        });

        // 3. Eventos de MindAR Propios
        this.sceneEl.addEventListener('ready', () => {
            this.logger.info("MindAR Evento: READY (Sistema listo).");
            this._onReady();
        });

        // 4. Polling Determinista de Propiedades (Reflector)
        this.pollTimer = setInterval(() => {
            const system = this.sceneEl.systems['mindar-image-system'];
            if (system) {
                // Reflejar estado interno
                const hasController = !!system.controller;
                const isSystemInit = system.initialized || false;
                
                if (isSystemInit && !this.initialized) {
                    this.logger.info("Axioma: Sistema Inicializado (vía polling).");
                    this._onReady();
                }

                if (hasController) {
                    console.log("[DEBUG-SYSTEM] Controller detected:", system.controller);
                }
            }
        }, 1000);

        // 5. Rastreo de Targets
        this.targetEl.addEventListener("targetFound", () => {
            this.logger.info("Target: LOCALIZADO.");
            if (this.onFoundCallback) this.onFoundCallback();
        });

        this.targetEl.addEventListener("targetLost", () => {
            this.logger.info("Target: PERDIDO.");
            if (this.onLostCallback) this.onLostCallback();
        });

        // 6. Fail-safe por tiempo (Si en 10s no hay ready, forzamos diagnóstico)
        setTimeout(() => {
            if (!this.initialized) {
                this.logger.warn("Diagnóstico: Tiempo de carga excedido. Revisar consola de desarrollador.");
                this._auditSystems();
            }
        }, 10000);
    }

    _auditSystems() {
        this.logger.info("Auditoría de Sistemas A-Frame...");
        const systems = this.sceneEl.systems;
        if (!systems['mindar-image-system']) {
            this.logger.error("SISTEMA MindAR NO REGISTRADO. Revisar carga de scripts.");
        } else {
            const sys = systems['mindar-image-system'];
            this.logger.info(`MindAR System detectado. Keys: ${Object.keys(sys).slice(0, 10).join(', ')}`);
        }
    }

    _onReady() {
        if (this.initialized) return;
        this.initialized = true;
        clearInterval(this.pollTimer);
        if (this.onReadyCallback) this.onReadyCallback();
    }

    start() {
        this.logger.info("Intentando Acceso a Hardware Cámara...");
        try {
            const system = this.sceneEl.systems['mindar-image-system'];
            system.start();
            this.logger.info("Cámara Iniciada.");
        } catch (e) {
            this.logger.error(`Falla en system.start(): ${e.message}`);
        }
    }
}
