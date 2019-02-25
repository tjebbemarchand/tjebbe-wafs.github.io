'use strict';

import { state } from './state.js';
import { render } from './render.js';
import { api } from './api.js';

export const data = {
    // Search and load the recipes from localStorage.
    load: function () {
        let localStorageData = localStorage.getItem('recipes');
        localStorageData = JSON.parse(localStorageData);
        console.log(localStorageData);
        console.log(state.data.searchTerm);
        if(!localStorageData) {
            api.get();
        } else if(localStorageData) {
            const recipes = localStorageData.find(function (recipe) {
                return recipe.searchTerm === state.data.searchTerm;
            });

            console.log(recipes);
        }

        /* 

        try {
            return recipesJSON ? data.parse(recipesJSON) : [];
        } catch (e) {
            return [];
        } */
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
        while(state.data.recipes > 0) {
            state.data.recipes.pop();
        }

        recipeData.forEach(function (recipe) {
            state.data.recipes.push({
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
    // Save the recipes in localStorage.
    save: function () {
        const dataToSave = [];
        dataToSave.push([state.data]);
        localStorage.setItem('recipes', JSON.stringify(dataToSave));
    },
    delete: function () {
        localStorage.removeItem('recipes');
    }
};