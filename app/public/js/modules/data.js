'use strict';

// Imports
import { app } from './app.js';
import { api } from './api.js';
import { render } from './render.js';

// Export object - data.
export const data = {
    // Function: handle the data.
    handle: async function () {
        let localStorageData = await localStorage.getItem(api.entries.q); // Get item from local storage with the search input key.
        localStorageData = JSON.parse(localStorageData); // Parse the data from local storage.

        let data;

        // If there is data.
        if (localStorageData) {
            data = localStorageData; // Store local storage data in the variable.
        // If there is no data.
        } else {
            const recipes = await api.get(); // Get the data from the API.
            data = recipes; // Store API data in the variable.
        }

        await render.clear(); // Clear the DOM.
        await this.store(data); // Store the results in a local object.
        await render.overviewPage(); // Render the overview page.
    },
    // Function(response data): convert the response data.
    parse: function (response) {
        return response.json(); // Return the parsed response data.
    },
    // Function(data): get only the relevant data.
    extract: function (data) {
        // Map over every recipe.
        return data.hits.map(function (hit) {
            // Map the data.
            return {
                recipe__id: hit.recipe.uri.split('#')[1], // Split the id before the hash.
                recipe__title: hit.recipe.label,
                recipe__image: hit.recipe.image,
                recipe__ingredients: hit.recipe.ingredientLines,
                recipe__calories: hit.recipe.calories,
                recipe__healthLabels: hit.recipe.healthLabels,
                recipe__totalWeight: hit.recipe.totalWeight,
                recipe__source: hit.recipe.source
            };
        });
    },
    // Function(recepten): store the data in a local object.
    store: function (recipeData) {
        app.state.data.recipes = []; // Remove current elements in the object.

        // Loop over the data.
        recipeData.forEach(function (recipe) {
            // Push every hit from the array in a object in a array.
            app.state.data.recipes.push({
                recipe__id: recipe.recipe__id,
                recipe__title: recipe.recipe__title,
                recipe__image: recipe.recipe__image,
                recipe__ingredients: recipe.recipe__ingredients,
                recipe__calories: recipe.recipe__calories,
                recipe__healthLabels: recipe.recipe__healthLabels,
                recipe__totalWeight: recipe.recipe__totalWeight,
                recipe__source: recipe.recipe__source
            });
        });
    },
    // Function(id from the hash link): find the right id from the array based on the id.
    find: async function (id) {
        // Return the recipe that matches with id from the paramter.
        return await app.state.data.recipes.find(function (recipe) {
            return recipe.recipe__id === id;
        });
    },
    // Function(sortBy for how to sort the data, recipe data): sort the data based on the sortBy paramter.
    sort: async function (sortBy, data) {
        let sortedData;

        // Check the value of the sortBy paramter with an switch statement.
        switch (sortBy) {
            // If sorted alphabetically
            case 'alphabetically':
                // Call the array sort function.
                sortedData = await data.sort(function(a, b) {
                    // If a comes before b, return -1.
                    if (a.recipe__title.toLowerCase() < b.recipe__title.toLowerCase()) {
                        return -1;
                    // If a comes after b, return 1.
                    } else if (a.recipe__title.toLowerCase() > b.recipe__title.toLowerCase()) {
                        return 1;
                    // Otherwise return 0.
                    } else {
                        return 0;
                    }
                });
                break;
            // If sorted reverse alphabetically.
            case 'reverse-alphabetically':
                // Call the array sort function.
                sortedData = await data.sort(function(a, b) {
                    // If a comes after b, return -1.
                    if (a.recipe__title.toLowerCase() > b.recipe__title.toLowerCase()) {
                        return -1;
                    // If a comes before b, return 1.
                    } else if (a.recipe__title.toLowerCase() < b.recipe__title.toLowerCase()) {
                        return 1;
                    // Otherwise return 0.
                    } else {
                        return 0;
                    }
                });
                break;
        }
        return sortedData; // Return the sorted data.
    },
    // Function(searchFilter): filter data based on text input.
    filter: function (searchFilter) {
        // Return the result of the recipe that matches the input value. 
        return app.state.data.recipes.filter(function (recipe) {
            return recipe.recipe__title.toLowerCase().includes(searchFilter.toLowerCase());
        });
    },
    // Function(recipes): save the data in local storage.
    save: function (recipes) {
        localStorage.setItem(api.entries.q, JSON.stringify(recipes)); // Save the recipes in local storage with the search input as the key.
    },
    // Function(data): to delete from local storage with an specific key. (currently not being used in the app)
    delete: function (data) {
        localStorage.removeItem(data); // Remove from local storage.
    }
};