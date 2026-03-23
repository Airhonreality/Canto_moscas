/**
 * APP: El Orquestador (VERSIÓN DESPERTAR MANUAL)
 * Punto de entrada del experimento modular.
 */
import { Logger } from './modules/Logger.js';
import { AudioEngine } from './modules/AudioEngine.js';
import { AREngine } from './modules/AREngine.js';
import { UIManager } from './modules/UIManager.js';

class CantoMoscasApp {
    constructor() {
        this.logger = new Logger('debug-logs');
        this.ui = new UIManager('overlay', 'start-btn', 'ui-loader', this.logger);
        this.audio = new AudioEngine('mosca-audio', this.logger);
        this.ar = new AREngine('scene-ar', 'target-mosca', this.logger);

        this.init();
    }

    async init() {
        this.logger.info("Fase 1: Auditoría de Assets (targets_mosca_1.mind)");
        
        try {
            const res = await fetch('./targets_mosca_1.mind', { method: 'HEAD' });
            if (res.ok) {
                this.logger.info("Asset Check: El archivo .mind está presente.");
            } else {
                this.logger.error(`Asset Check: El archivo fallo con HTTP Status: ${res.status}`);
            }
        } catch (e) {
            this.logger.error("Asset Check: Error de conexión o CORS.");
        }

        // 2. Orquestar la Hidratación (Botón arriba)
        this.ar.onHydratedCallback = () => {
            this.logger.info("Orquestador: Sistema Hidratado. Mostrando botón.");
            this.ui.readyToStart();
        };

        // 3. Orquestar la Activación Actual (Ready)
        this.ar.onActiveCallback = () => {
            this.logger.info("Orquestador: Cámara y Tracking Activos.");
        };

        // 4. Orquestar el Rastreo
        this.ar.onFoundCallback = () => {
            this.audio.play();
            document.getElementById('scan-hint').style.display = 'none';
        };

        this.ar.onLostCallback = () => {
            this.audio.pause();
            document.getElementById('scan-hint').style.display = 'block';
        };

        // 5. Configurar Botón
        document.getElementById('start-btn').onclick = () => this.start();
    }

    async start() {
        this.logger.info("Fase 2: Secuencia de Inicio de Usuario.");
        await this.audio.unlock();
        this.ar.start(); // Despierta el motor MindAR
        this.ui.closeOverlay();
    }
}

// Iniciar aplicación
window.addEventListener('DOMContentLoaded', () => {
    window.App = new CantoMoscasApp();
});
