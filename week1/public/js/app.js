'use strict';

(function() {
    const config = {
        proxy: 'https://cors-anywhere.herokuapp.com/',
        appID: 'c83b21f1',
        appKey: 'f1e2173ac672d053a64913c59ad6932b',
        url: 'https://api.edamam.com/search?q='
    };

    const state = {
        recipes: []
    };

    const filters = {
        search: '',
        sortBy: 'name',
        filterBy: undefined
    };

    // DOM
    const app = document.querySelector('main');
    const container = document.querySelector('.container');
    const searchForm = document.querySelector('#searchForm');
    const inputRecipeField = document.querySelector('#inputRecipe');
    const searchRecipeBtn = document.querySelector('#searchRecipe');

    // APP
    var renderRecipes = (recipes) => {
        state.recipes.forEach((recipe) => {
            const imageEl = document.createElement('img');
            imageEl.src = recipe.image;

            const titleEl = document.createElement('h2');
            titleEl.textContent = recipe.title;

            container.appendChild(imageEl);
            imageEl.insertAdjacentElement('afterend', titleEl);
        });
    };

    var searchRecipe = () => {
        container.innerHTML = ''; // Clear the search results.
        const api = config.url + filters.search + '&app_id=' + config.appID + '&app_key=' + config.appKey;

        // API request
        let request = new XMLHttpRequest();
        request.open('GET', api, true);

        request.onload =  function() {
            const data = JSON.parse(this.response);

            if (request.status >= 200 && request.status < 400) {
                data.hits.forEach(hit => {
                    state.recipes.push({
                        title: hit.recipe.label,
                        image: hit.recipe.image,
                        ingredients: hit.recipe.ingredientLines,
                        calories: hit.recipe.calories
                    });
                });
                renderRecipes();
            } else {
                console.log('error');
                const errorMessage = createElement('p');
                errorMessage.textContent = 'Something went wrong here';
                app.appendChild(errorMessage);
            }
        };
        request.send();
    };

    searchRecipeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filters.search = inputRecipeField.value;
        searchRecipe();
        inputRecipeField.value = '';
    });

})();