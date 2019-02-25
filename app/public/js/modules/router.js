'use strict';

import { render } from './render.js';
import { data } from './data.js';
import { app } from './app.js';
import { api } from './api.js';

export const router = {
    routes: function() {
        routie({
            '/': function () {
                render.clear();
                render.homePage();
            },
            '/overviewPage/:input': function (input) {
                api.entries.q = input;
                render.renderLoader();
                data.handle();
            },
            '/detailPage/:id': function (id) {
                const recipe = app.state.data.recipes.find(function (recipe) {
                    return recipe.recipe__id === id;
                });
                render.clear();
                render.detailPage(recipe);
            }
        });
    }
};