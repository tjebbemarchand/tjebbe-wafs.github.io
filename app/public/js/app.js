'use strict';

(function () {
    // State object with filters and temporary place for the recipes.
    const state = {
        filters: {
            searchTerm: '',
            sortBy: 'name',
            filterBy: undefined,
        },
        recipes: {
            recipe: '',
            recipes: []
        }
    };

    // DOM object with all the DOM objects.
    const dom = {
        app: document.querySelector('main'),
        container: document.querySelector('.container'),
        searchForm: document.querySelector('#searchForm'),
        inputRecipeField: document.querySelector('#inputRecipe'),
        searchRecipeBtn: document.querySelector('#searchRecipe')
    };

    // API object
    const api = {
        proxy: 'https://cors-anywhere.herokuapp.com/',
        url: 'https://api.edamam.com/search?q=',
        entries: {
            app_id: 'c83b21f1',
            app_key: 'f1e2173ac672d053a64913c59ad6932b',
        },
        // Create url based on the entries object.
        createURL: function () {
            const URLOptions = Object.entries(this.entries)
                .map(entry => entry.join("="))
                .join("&");
            const url = `${this.url}${state.filters.search}&${URLOptions}`;
            // console.log(url);
            return url;
        },
        // Get new recipes from the api.
        getRecipes: function () {
            const getData = new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest();
                request.open('GET', api.createURL(), true)

                request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                        const dataResponse = data.parse(this.response);
                        resolve(dataResponse);
                    } else {
                        reject(error);
                    }
                };

                request.onerror = () => {
                    console.log('Error with loading the data');
                };

                request.send();
            });

            getData.then(dataResponse => {
                    data.store(dataResponse.hits);
                    data.save(dataResponse);                })
                .then(() => {
                    render.recipes();
                });
        }
    };

    const data = {
        // Search and load the recipes from localStorage.
        load: function () {
            const localStorageData = localStorage.getItem('recipes');
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
            }
        },
        // Parse the recipes before use.
        parse: function (response) {
            return JSON.parse(response);
        },
        extract: function(data) {
            const filteredData = data.map((hit) => {
                
            });
        },
        // Store the recipes in the temporary object.
        store: function (recipeData) {
            state.recipes.recipe = state.filters.search;
            /*  BELOW NOT WORKING WITH LOCALSTORAGE DATA!!!!!! REFACTOR  */
            recipeData.forEach(hit => {
                state.recipes.recipes.push({
                    title: hit.recipe ? hit.recipe.label : hit.title,
                    image: hit.recipe ? hit.recipe.image : hit.image,
                    ingredients: hit.recipe ? hit.recipe.ingredientLines : hit.ingredients,
                    calories: hit.recipe ? hit.recipe.calories : hit.calories
                });
            });
        },
        // Save the recipes in localStorage.
        save: function () {
            localStorage.setItem('recipes', JSON.stringify(state.recipes));
        }
    };

    // Render actor
    const render = {
        // Render the recipes on the screen.
        recipes: function () {
            state.recipes.recipes.forEach((recipe) => {
                const imageEl = document.createElement('img');
                imageEl.src = recipe.image;

                const titleEl = document.createElement('h2');
                titleEl.textContent = recipe.title;

                dom.container.appendChild(imageEl);
                imageEl.insertAdjacentElement('afterend', titleEl);
            });
        },
        // Clear the container.
        clear: function () {
            container.innerHTML = ''; // Clear the search results.
        }
    };

    // Click event listener for the search button.
    dom.searchRecipeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.filters.searchTerm = dom.inputRecipeField.value;
        // data.load();
        api.getRecipes();
        dom.inputRecipeField.value = '';
    });
})();




































/* 'use strict';

(function () {
    // Filters object.
    const state = {
        filters: {
            search: '',
            sortBy: 'name',
            filterBy: undefined,
        },
        recipes: []
    };

    // DOM object.
    const dom = {
        app: document.querySelector('main'),
        container: document.querySelector('.container'),
        searchForm: document.querySelector('#searchForm'),
        inputRecipeField: document.querySelector('#inputRecipe'),
        searchRecipeBtn: document.querySelector('#searchRecipe')
    };

    // API actor
    const api = {
        proxy: 'https://cors-anywhere.herokuapp.com/',
        url: 'https://api.edamam.com/search?q=',
        entries: {
            app_id: 'c83b21f1',
            app_key: 'f1e2173ac672d053a64913c59ad6932b',
        },
        createURL: function() {
            const URLOptions = Object.entries(this.entries)
                .map(entry => entry.join("="))
                .join("&");
            const url = `${this.url}${state.filters.search}&${URLOptions}`;
            // console.log(url);
            return url;
        },
        get: function() {
            // API request
            let request = new XMLHttpRequest();
            request.open('GET', this.createURL(), true);

            request.onload = function () {
                const data = api.parse(this.response);

                if(request.status >= 200 && request.status < 400) {
                    api.store(data);
                    render.recipes();
                } else {
                    console.log('error');
                    const errorMessage = createElement('p');
                    errorMessage.textContent = 'Something went wrong here';
                    app.appendChild(errorMessage);
                }
            };
            request.send();
        },
        store: function(data) {
            data.hits.forEach(hit => {
                state.recipes.push({
                    title: hit.recipe.label,
                    image: hit.recipe.image,
                    ingredients: hit.recipe.ingredientLines,
                    calories: hit.recipe.calories
                });
            });
        },
        parse: function(response) {
            return JSON.parse(response);
        }
    };

    // Render actor
    const render = {
        recipes: function() {
            state.recipes.forEach((recipe) => {
                const imageEl = document.createElement('img');
                imageEl.src = recipe.image;
    
                const titleEl = document.createElement('h2');
                titleEl.textContent = recipe.title;
    
                dom.container.appendChild(imageEl);
                imageEl.insertAdjacentElement('afterend', titleEl);
            });
        },
        clear: function() {
            container.innerHTML = ''; // Clear the search results.
        }
    };

    dom.searchRecipeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.filters.search = dom.inputRecipeField.value;
        api.get();
        dom.inputRecipeField.value = '';
    });
})(); */