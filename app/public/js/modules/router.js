'use strict';

// Imports
import { render } from './render.js';
import { data } from './data.js';
import { api } from './api.js';
import { app } from './app.js';

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
            '/overviewPage/:input': async function (input) {
                api.entries.q = input; // Store search input in the API Object.
                render.renderLoader(); // Render the loader.
                await data.handle(); // Handle the data.
                await render.clear(); // Clear the DOM.

                // Check if there are results in the array.
                if(app.state.data.recipes.length > 0) {
                    await render.overviewPage(); // Render the overview page.
                } else {
                    render.noResults(); // Render the no results message.
                }
            },
            // Detail page
            '/detailPage/:id': async function (id) {
                const recipe = await data.find(id); // Call the find function to get the recipe based on the id.
                if(recipe) {
                    render.clear(); // Clear the page.
                    render.detailPage(recipe); // Render the detail page with the recipe.
                } else {
                    window.location.hash = '/404';
                }
            },
            '/404': function () {
                render.clear();
                render.errorPage();
            }
        });
    }
};