/**
 * BaseComponent - A base class that provides common functionality for all components
 * This class includes:
 * 1. Error handling
 * 2. Logging
 * 3. Event management
 * 4. State management
 * 5. Lifecycle hooks
 */
export class BaseComponent {
    constructor() {
        this._events = new Map();
        this._state = {};
        this._isDestroyed = false;
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
        this.trigger('error', { error, context });
        throw error;
    }

    /**
     * Sets component state
     * @param {Object} newState - New state to merge with existing state
     */
    setState(newState) {
        this._state = { ...this._state, ...newState };
        this.trigger('stateChange', this._state);
    }

    /**
     * Gets current component state
     * @returns {Object} Current state
     */
    getState() {
        return { ...this._state };
    }

    /**
     * Adds an event listener
     * @param {string} event - The event name
     * @param {Function} callback - The callback function
     */
    on(event, callback) {
        if (this._isDestroyed) {
            this.log('Cannot add event listener to destroyed component', 'warn');
            return;
        }
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
        if (this._isDestroyed) {
            this.log('Cannot trigger event on destroyed component', 'warn');
            return;
        }
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
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        // Override in child classes if needed
    }

    /**
     * Cleans up resources when component is destroyed
     */
    destroy() {
        if (this._isDestroyed) return;
        
        this.beforeDestroy();
        this._events.clear();
        this._state = {};
        this._isDestroyed = true;
        
        this.log('Component destroyed');
    }

    /**
     * Checks if component is destroyed
     * @returns {boolean} True if component is destroyed
     */
    isDestroyed() {
        return this._isDestroyed;
    }
} 