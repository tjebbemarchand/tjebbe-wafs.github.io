'use strict';

import { render } from './render.js';

export const router = {
    homePage: function () {
        routie('/', function () {
            window.location.hash = '/';
            render.clear();
            render.homePage();
        });
        routie('/');
    },
    overviewPage: function () {
        routie("overviewPage", function() {
            window.location.hash = 'overviewPage';
            render.clear();
            render.overviewPage();
        });
        routie('overviewPage');
    },
    detailPage: function (id) {
        routie(":id", function(id) {
            window.location.hash = `detailPage/${id}`
            render.clear();
            render.detailPage(id);
        });
        routie(id);
    }
};