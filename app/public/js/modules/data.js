'use strict';

/* beautify preserve:start */
import { app } from './app.js';
import { api } from './api.js';
import { render } from './render.js';
/* beautify preserve:end */

export const data = {
    // Search and load the recipes from localStorage.
    handle: async function () {
        let localStorageData = await localStorage.getItem(api.entries.q);
        localStorageData = JSON.parse(localStorageData);

        let data;
        if (localStorageData) {
            data = localStorageData;
        } else {
            const recipes = await api.get();
            data = recipes;
        }

        await render.clear();
        await render.overviewPage(data);
        await this.store(data);
    },
    // Parse the recipes before use.
    parse: function (response) {
        return response.json();
    },
    extract: function (data) {
        return data.hits.map(function (hit) {
            return {
                recipe__id: hit.recipe.uri.split('#')[1],
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
        while (app.state.data.recipes > 0) {
            app.state.data.recipes.pop();
        }

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
    // Save the recipes in localStorage.
    save: function (recipes) {
        localStorage.setItem(api.entries.q, JSON.stringify(recipes));
    },
    delete: function (data) {
        localStorage.removeItem(data);
    }
};