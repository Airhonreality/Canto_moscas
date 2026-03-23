/**
 * APP: El Orquestador
 * Punto de entrada del experimento modular.
 */
import { Logger } from './modules/Logger.js';
import { AudioEngine } from './modules/AudioEngine.js';
import { AREngine } from './modules/AREngine.js';
import { UIManager } from './modules/UIManager.js';

class CantoMoscasApp {
    constructor() {
        // Inicializar Servicios
        this.logger = new Logger('debug-logs');
        this.ui = new UIManager('overlay', 'start-btn', 'ui-loader', this.logger);
        this.audio = new AudioEngine('mosca-audio', this.logger);
        this.ar = new AREngine('scene-ar', 'target-mosca', this.logger);

        this.init();
    }

    async init() {
        this.logger.info("Iniciando Verificación de Assets...");
        
        // 1. Verificar existencia del archivo .mind (Asset Audit)
        try {
            const response = await fetch('./targets_mosca_1.mind', { method: 'HEAD' });
            if (response.ok) {
                this.logger.info("Asset Audit: targets_mosca_1.mind localizado satisfactoriamente.");
            } else {
                this.logger.error("Asset Audit: targets_mosca_1.mind no encontrado (404). El sistema AR fallará.");
            }
        } catch (e) {
            this.logger.error("Asset Audit: Error al localizar targets (CORS o Red).");
        }

        // 2. Orquestar el Ready
        this.ar.onReadyCallback = () => {
            this.ui.readyToStart();
        };

        // 3. Orquestar el Rastreo
        this.ar.onFoundCallback = () => {
            this.audio.play();
            document.getElementById('scan-hint').style.display = 'none';
        };

        this.ar.onLostCallback = () => {
            this.audio.pause();
            document.getElementById('scan-hint').style.display = 'block';
        };

        // 4. Configurar Botón de Arranque
        document.getElementById('start-btn').onclick = () => this.start();
    }

    async start() {
        this.logger.info("Secuencia de Inicio de Usuario disparada.");
        
        // Desbloquear Audio Context (Imprescindible por seguridad del navegador)
        await this.audio.unlock();
        
        // Iniciar Cámara
        this.ar.start();
        
        // Limpiar Overlay
        this.ui.closeOverlay();
    }
}

// Iniciar aplicación
window.addEventListener('DOMContentLoaded', () => {
    window.App = new CantoMoscasApp();
});
