'use strict';

// Imports
import { render } from './render.js';
import { data } from './data.js';
import { api } from './api.js';

// Export object - router.
export const router = {
    // Function: routes
    routes: function () {
        // Call the routes function.
        routie({
            // Homepage
            '/': function () {
                render.clear(); // Clear the DOM
                render.homePage(); // Render the homepage
            },
            // Overview page
            '/overviewPage/:input': function (input) {
                api.entries.q = input; // Store search input in the API Object.
                render.renderLoader(); // Render the loader.
                data.handle(); // Handle the data.
            },
            // Detail page
            '/detailPage/:id': async function (id) {
                const recipe = await data.find(id);
                render.clear();
                render.detailPage(recipe);
            }
        });
    }
};