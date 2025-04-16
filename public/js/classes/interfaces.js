/**
 * Interface for components that can be validated
 * @interface Validatable
 */
export class Validatable {
    /**
     * Validates the component
     * @returns {{isValid: boolean, errors: Array<string>}} Validation result
     */
    validate() {
        throw new Error('validate() must be implemented');
    }
}

/**
 * Interface for components that can be rendered
 * @interface Renderable
 */
export class Renderable {
    /**
     * Renders the component
     * @param {HTMLElement} container - Container to render into
     */
    render(container) {
        throw new Error('render() must be implemented');
    }
}

/**
 * Interface for components that can be persisted
 * @interface Persistable
 */
export class Persistable {
    /**
     * Saves the component state
     * @returns {Promise<void>}
     */
    save() {
        throw new Error('save() must be implemented');
    }

    /**
     * Loads the component state
     * @returns {Promise<void>}
     */
    load() {
        throw new Error('load() must be implemented');
    }
}

/**
 * Interface for components that can be updated
 * @interface Updatable
 */
export class Updatable {
    /**
     * Updates the component state
     * @param {Object} updates - New state values
     */
    update(updates) {
        throw new Error('update() must be implemented');
    }
} 