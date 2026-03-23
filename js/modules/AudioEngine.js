/**
 * AUDIO ENGINE: El Coro
 * Gestiona el ciclo de vida del sonido de la mosca.
 */
export class AudioEngine {
    constructor(audioElementId, logger) {
        this.audio = document.getElementById(audioElementId);
        this.logger = logger;
        this.logger.info("Audio Engine Inicializado.");
        
        if (!this.audio) {
            this.logger.error("Audio Elemento no encontrado en el DOM.");
        }
    }

    async unlock() {
        this.logger.info("Desbloqueando AudioContext...");
        try {
            await this.audio.play();
            this.audio.pause();
            this.audio.currentTime = 0;
            this.logger.info("AudioContext Desbloqueado satisfactoriamente.");
        } catch (e) {
            this.logger.error("Error al desbloquear audio: " + e.message);
        }
    }

    play() {
        this.logger.info("Reproduciendo Canto de Mosca 🪰.");
        this.audio.play().catch(e => this.logger.error(e.message));
    }

    pause() {
        this.logger.info("Silenciando Mosca (Fuera de vista).");
        this.audio.pause();
    }
}
