'use strict';

// Imports
import { router } from "./router.js";

// Export object - app.
export const app = {
    // Function: initialize
    init: function () {
        router.routes(); // Call the routes function inside router.
    },
    // DOM object with dom elements.
    dom: {
        body: document.querySelector('body'),
        app: document.querySelector('main'),
    },
    // State object.
    // Current recipes in the app.
    state: {
        data: {
            recipes: []
        }
    }
};