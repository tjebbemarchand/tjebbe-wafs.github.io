'use strict';

// Imports
import { data } from './data.js';

// Export object - api.
export const api = {
    url: 'https://api.edamam.com/search?', // API url

    // URL entries
    entries: {
        q: '', // Search input
        app_id: 'c83b21f1', // App id
        app_key: 'f1e2173ac672d053a64913c59ad6932b', // App key
        from: '0', // Results starting at 0.
        to: '20' // Results ending at 20.
    },
    // Function: create api url.
    createURL: function () {
        // Create url with all the entires from above.
        const URLOptions = Object.entries(this.entries)
            .map(function (entry) {
                return entry.join("=") // Insert an = for every entry.
            }).join("&"); // After every entry insert an &.
        const url = `${this.url}&${URLOptions}`; // Finish the url with the URL and the URL options.
        return url; // Return the url to the function get.
    },
    // Async function: get data from the api.
    get: async function (url = this.createURL()) {
        const response = await fetch(url); // Get data from the url.

        // Check what the status is.
        if (response.status >= 200 && response.status < 400) {
            const responseData = await data.parse(response); // Parse the response data.
            const extracedData = await data.extract(responseData); // Get only the relevent data.
            return extracedData; // Return the filtered data.
        } else {
            throw new Error('Unable to get the recipes'); // Throw a error.
        }
    }
};