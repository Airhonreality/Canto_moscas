/**
 * LOGGER: El Notario del Sistema
 * Captura todos los eventos críticos para auditoría visual.
 */
export class Logger {
    constructor(elementId) {
        this.logElement = document.getElementById(elementId);
        this.maxLogs = 8;
        this.logs = [];
        this.info("Logger Inicializado. Auditoría activa.");
    }

    info(msg) {
        console.log(`[INFO] ${msg}`);
        this._addLog(`[OK] ${msg}`, '#ffd700');
    }

    warn(msg) {
        console.warn(`[WARN] ${msg}`);
        this._addLog(`[!] ${msg}`, '#ffaa00');
    }

    error(msg) {
        console.error(`[ERROR] ${msg}`);
        this._addLog(`[CRASH] ${msg}`, '#ff4444');
    }

    _addLog(msg, color) {
        if (!this.logElement) return;
        const entry = document.createElement('div');
        entry.style.color = color;
        entry.style.marginBottom = '4px';
        entry.style.fontSize = '12px';
        entry.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
        
        this.logElement.prepend(entry);
        this.logs.push(entry);

        if (this.logs.length > this.maxLogs) {
            const old = this.logs.shift();
            old.remove();
        }
    }
}
