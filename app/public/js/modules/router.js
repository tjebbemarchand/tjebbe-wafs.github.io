'use strict';

import { render } from './render.js';
import { data } from './data.js';
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
            '/detailPage/:id': async function (id) {
                const recipe = await data.find(id);
                render.clear();
                render.detailPage(recipe);
            }
        });
    }
};