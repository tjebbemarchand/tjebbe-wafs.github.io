'use strict';

import { state } from './state.js';

export const data = {
    // Search and load the recipes from localStorage.
    load: function () {
        let localStorageData = localStorage.getItem('recipes');
        localStorageData = JSON.parse(localStorageData);


        /* const localStorageData = localStorage.getItem('recipes');
        const recipes = data.parse(localStorageData);
        
        if (recipes === []) {
            api.getRecipes();
        } else {
            if (recipes.recipe === state.filters.searchTerm) {
                this.store(recipes.recipes);
                // render.recipes(); // Needs 'state.recipes' to render......
            }
        }

        try {
            return recipesJSON ? data.parse(recipesJSON) : [];
        } catch (e) {
            return [];
        } */
    },
    // Parse the recipes before use.
    parse: function (response) {
        return JSON.parse(response);
    },
    extract: function (data) {
        return data.hits.map(function (hit) {
            return {
                recipe__id: hit.recipe.uri.split('#')[1],
                recipe__title: hit.recipe.label,
                recipe__image: hit.recipe.image,
                recipe__ingredients: hit.recipe.ingredientLines,
                recipe__calories: (Math.round(hit.recipe.calories)),
                recipe__healthLabels: hit.recipe.healthLabels,
                recipe__totalWeight: hit.recipe.totalWeight
            };
        });
    },
    // Store the recipes in the temporary object.
    store: function (recipeData) {
        // state.data.searchTerm = state.filters.searchTerm;

        recipeData.forEach(function (recipe) {
            state.data.recipes.push({
                recipe__id: recipe.recipe__id,
                recipe__title: recipe.recipe__title,
                recipe__image: recipe.recipe__image,
                recipe__ingredients: recipe.recipe__ingredients,
                recipe__calories: recipe.recipe__calories,
                recipe__healthLabels: recipe.recipe__healthLabels,
                recipe__totalWeight: recipe.recipe__totalWeight
            });
        });
    },
    // Save the recipes in localStorage.
    save: function () {
        const dataToSave = [];
        dataToSave.push(state.data);
        localStorage.setItem('recipes', JSON.stringify(dataToSave));
    },
    delete: function () {
        localStorage.removeItem('recipes');
    }
};