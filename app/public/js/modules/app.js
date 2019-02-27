'use strict';

import { router } from "./router.js";

export const app = {
    init: function() {
        router.routes();
    },
    dom: {
        body: document.querySelector('body'),
        app: document.querySelector('main'),
    },
    state: {
        data: {
            recipes: []
        }
    }
};