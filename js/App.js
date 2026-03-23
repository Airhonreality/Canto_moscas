/**
 * APP: El Orquestador (VERSIÓN DETERMINISTA FINAL)
 * Prioridad: El Usuario es el Motor de arranque.
 */
import { Logger } from './modules/Logger.js';
import { AudioEngine } from './modules/AudioEngine.js';
import { AREngine } from './modules/AREngine.js';
import { UIManager } from './modules/UIManager.js';

class CantoMoscasApp {
    constructor() {
        this.logger = new Logger();
        this.ui = new UIManager('nav-layer', 'back-to-menu', 'ui-loader', this.logger);
        this.audio = new AudioEngine('mosca-audio', this.logger);
        this.ar = new AREngine('scene-ar', 'target-mosca', this.logger);

        this.init();
    }

    async init() {
        this.logger.info("Fase 1: Auditoría de Assets Integrada.");
        
        // Audit de Assets Directo (Sin esperar al motor)
        try {
            const res = await fetch('./targets_mosca_1.mind', { method: 'HEAD' });
            if (res.ok) {
                this.logger.info("Asset Check OK. Preparando Interfaz...");
                this.ui.readyToStart(); // ¡BOTÓN ARRIBA DE INMEDIATO!
            } else {
                this.logger.error("Error: Archivo .mind no accesible (404).");
            }
        } catch (e) {
            this.logger.warn("Asset Check omitido por red restrictiva (CORS/Offline).");
            this.ui.readyToStart(); // Intentamos de todas formas
        }

        // Configurar Eventos de Rastreo (Para cuando inicie)
        this.ar.onFoundCallback = () => {
            this.audio.play();
            document.getElementById('scan-hint').style.display = 'none';
        };

        this.ar.onLostCallback = () => {
            this.audio.pause();
            document.getElementById('scan-hint').style.display = 'block';
        };

        // Configurar Eventos de Navegación
        this._setupEvents();
    }

    _setupEvents() {
        document.getElementById('start-btn').onclick = () => this.startAR();
        document.getElementById('back-to-menu').onclick = () => this.stopAR();
        document.getElementById('go-authors-btn').onclick = () => this.ui.showView('view-authors');
        document.getElementById('back-to-book-btn').onclick = () => this.ui.showView('view-book');
    }

    async startAR() {
        this.logger.info("Secuencia de Inicio de Cámara...");
        await this.audio.unlock();
        this.ui.setARMode(true); // Ocultar UI Menu
        this.ar.start(); // El motor MindAR arranca AQUÍ, cuando el usuario ya pulsó.
    }

    stopAR() {
        this.logger.info("Regresando al Menú...");
        this.audio.pause();
        this.ar.stop();
        this.ui.setARMode(false);
    }
}

// Iniciar aplicación
window.addEventListener('DOMContentLoaded', () => {
    window.App = new CantoMoscasApp();
});
