'use strict';

import { state } from './state.js';
import { data } from './data.js';
import { router } from './router.js';
import { render } from './render.js';

// API object
export const api = {
    proxy: 'https://cors-anywhere.herokuapp.com/',
    url: 'https://api.edamam.com/search?',
    entries: {
        app_id: 'c83b21f1',
        app_key: 'f1e2173ac672d053a64913c59ad6932b',
        from: '0',
        to: '20'
    },
    // Create url based on the entries object.
    createURL: function () {
        const URLOptions = Object.entries(this.entries)
            .map(entry => entry.join("="))
            .join("&");
        const url = `${this.url}q=${state.data.searchTerm}&${URLOptions}`;
        return url;
    },
    // Get new recipes from the api.
    get: function (url = this.createURL()) {
        const getData = new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    const responseData = data.parse(this.response);
                    resolve(responseData);
                } else {
                    reject(error);
                }
            };

            request.onerror = function () {
                console.error('Error with loading the data');
            };

            request.send();
        })
        .then(function (dataResponse) {
            return data.extract(dataResponse);
        })
        .then(function (extracedData) {
            data.store(extracedData);
        })
        .then(function () {
            // data.save();
        })
        .then(function () {
            router.overviewPage();
            render.clearLoader();
        });
    }
};