'use strict';

// Imports
import { app } from './app.js';
import { api } from './api.js';
import { render } from './render.js';

// Export object - data.
export const data = {
    // Async function: handle the data.
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
/////////////////////////////////////////////////////////
        await render.clear();
        await this.store(data);
        await render.overviewPage();
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
    // Store the recipes in the temporary object.
    store: function (recipeData) {
        // while (app.state.data.recipes.length > 0) {
        //     app.state.data.recipes.pop();
        // }

        app.state.data.recipes = [];

        recipeData.forEach(function (recipe) {
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
    find: async function (id) {
        return await app.state.data.recipes.find(function (recipe) {
            return recipe.recipe__id === id;
        });
    },
    sort: async function (sortBy, data) {
        let sortedData;
        switch (sortBy) {
            case 'alphabetically':
                sortedData = await data.sort((a, b) => {
                    if (a.recipe__title.toLowerCase() < b.recipe__title.toLowerCase()) {
                        return -1;
                    } else if (a.recipe__title.toLowerCase() > b.recipe__title.toLowerCase()) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            case 'reverse-alphabetically':
                sortedData = await data.sort((a, b) => {
                    if (a.recipe__title.toLowerCase() > b.recipe__title.toLowerCase()) {
                        return -1;
                    } else if (a.recipe__title.toLowerCase() < b.recipe__title.toLowerCase()) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
        }
        return sortedData;
    },
    filter: function (searchFilter) {
        return app.state.data.recipes.filter(function (recipe) {
            return recipe.recipe__title.toLowerCase().includes(searchFilter.toLowerCase());
        });
    },
    // Function(recipes): save the data in local storage.
    save: function (recipes) {
        localStorage.setItem(api.entries.q, JSON.stringify(recipes)); // Save the recipes in local storage with the search input as the key.
    },
    delete: function (data) {
        localStorage.removeItem(data);
    }
};