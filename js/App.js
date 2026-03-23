/**
 * APP: El Orquestador (SPA + AR + AUDITORÍA)
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
        
        try {
            const res = await fetch('./targets_mosca_1.mind', { method: 'HEAD' });
            if (res.ok) this.logger.info("Asset Check: El archivo .mind está presente.");
            else this.logger.error(`Asset Check: El archivo fallo con HTTP Status: ${res.status}`);
        } catch (e) {
            this.logger.warn("Asset Check: No se pudo verificar asset por red (CORS o Offline).");
        }

        // 2. Orquestar la Hidratación
        this.ar.onHydratedCallback = () => {
            this.logger.info("AR Hidratado. Preparando Interfaz...");
            this.ui.readyToStart();
        };

        // 3. Orquestar la Detección
        this.ar.onFoundCallback = () => {
            this.audio.play();
            document.getElementById('scan-hint').style.display = 'none';
        };

        this.ar.onLostCallback = () => {
            this.audio.pause();
            document.getElementById('scan-hint').style.display = 'block';
        };

        // 4. Configurar Eventos de Navegación
        this._setupEvents();
    }

    _setupEvents() {
        // Iniciar AR
        document.getElementById('start-btn').onclick = () => this.startAR();

        // Volver del AR
        document.getElementById('back-to-menu').onclick = () => this.stopAR();

        // Ir a Autores
        document.getElementById('go-authors-btn').onclick = () => this.ui.showView('view-authors');

        // Volver al Libro desde Autores
        document.getElementById('back-to-book-btn').onclick = () => this.ui.showView('view-book');
    }

    async startAR() {
        this.logger.info("Transición a AR Iniciada.");
        await this.audio.unlock();
        this.ar.start(); // Iniciar Cámara
        this.ui.setARMode(true); // Ocultar UI Menu
    }

    stopAR() {
        this.logger.info("Regresando al Menú...");
        this.audio.pause();
        this.ar.stop(); // Apagar Cámara y Liberar Recursos
        this.ui.setARMode(false); // Mostrar UI Menu
    }
}

// Iniciar aplicación
window.addEventListener('DOMContentLoaded', () => {
    window.App = new CantoMoscasApp();
});
