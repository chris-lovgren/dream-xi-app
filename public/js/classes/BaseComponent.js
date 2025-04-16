/**
 * BaseComponent - A base class that provides common functionality for all components
 * This class includes:
 * 1. Error handling
 * 2. Logging
 * 3. Event management
 */
export class BaseComponent {
    constructor() {
        this._events = new Map();
    }

    /**
     * Logs a message to the console
     * @param {string} message - The message to log
     * @param {string} type - The type of log (info, warn, error)
     */
    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${this.constructor.name}] [${type.toUpperCase()}]: ${message}`);
    }

    /**
     * Handles errors consistently across components
     * @param {Error} error - The error to handle
     * @param {string} context - Where the error occurred
     */
    handleError(error, context) {
        this.log(`Error in ${context}: ${error.message}`, 'error');
        throw error;
    }

    /**
     * Adds an event listener
     * @param {string} event - The event name
     * @param {Function} callback - The callback function
     */
    on(event, callback) {
        if (!this._events.has(event)) {
            this._events.set(event, []);
        }
        this._events.get(event).push(callback);
    }

    /**
     * Removes an event listener
     * @param {string} event - The event name
     * @param {Function} callback - The callback function to remove
     */
    off(event, callback) {
        if (this._events.has(event)) {
            const callbacks = this._events.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Triggers an event
     * @param {string} event - The event name
     * @param {*} data - Data to pass to event listeners
     */
    trigger(event, data) {
        if (this._events.has(event)) {
            this._events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.handleError(error, `Event handler for ${event}`);
                }
            });
        }
    }

    /**
     * Cleans up resources when component is destroyed
     */
    destroy() {
        this._events.clear();
    }
} 