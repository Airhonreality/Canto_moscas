/**
 * LOGGER: El Notario Silent (PROD)
 * Auditoría interna vía consola.
 */
export class Logger {
    constructor() {
        this.info("Sistema de Auditoría de Producción Activo.");
    }

    info(msg) {
        console.log(`%c[INFO] %c${msg}`, 'color: #ffd700; font-weight: bold', 'color: white');
    }

    warn(msg) {
        console.warn(`%c[WARN] %c${msg}`, 'color: #ffaa00; font-weight: bold', 'color: white');
    }

    error(msg) {
        console.error(`%c[ERROR] %c${msg}`, 'color: #ff4444; font-weight: bold', 'color: white');
    }
}
