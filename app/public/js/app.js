'use strict';

(function () {
    // State object with filters and temporary place for the recipes.
    const state = {
        filters: {
            searchTerm: '',
            sortBy: 'name',
            filterBy: undefined,
        },
        data: {
            searchTerm: '',
            recipes: []
        }
    };

    // DOM object with all the DOM objects.
    const dom = {
        app: document.querySelector('main'),
        container: document.querySelector('.container')
    };

    const router = {
        homePage: function () {
            routie('/', function () {
                window.location.hash = '/';
                dom.app.innerHTML = '';
                const homePage = `
                    <h1>Web App from Scratch</h1>
                    <form id="searchForm">
                        <input type="text" name="inputRecipe" id="inputRecipe">
                        <button name="searchRecipe" id="searchRecipe">Search recipe</button>
                    </form>
                    <div class="container"></div>
                    <!-- <button id="test">Test</button> -->
                `;
                dom.app.innerHTML = homePage;

                document.querySelector('#searchRecipe').addEventListener('click', function (e) {
                    e.preventDefault();
                    state.filters.searchTerm = document.querySelector('#inputRecipe').value.toLowerCase();
                    // data.load();
                    api.get(api.createOverviewURL());
                    document.querySelector('#inputRecipe').value = '';
                });
            });
            routie('/');
        },
        overviewPage: function () {
            routie('overviewPage', function () {
                dom.app.innerHTML = '';
                window.location.hash = 'overviewPage';
                render.recipes();
            });
            routie('overviewPage');
        },
        detailPage: function () {
            routie('detailPage', function () {
                window.location.hash = 'detailPage';
            });
            routie('detailPage');
        }
    };

    // API object
    const api = {
        proxy: 'https://cors-anywhere.herokuapp.com/',
        url: 'https://api.edamam.com/search?',
        entries: {
            app_id: 'c83b21f1',
            app_key: 'f1e2173ac672d053a64913c59ad6932b',
        },
        // Create url based on the entries object.
        createOverviewURL: function () {
            const URLOptions = Object.entries(this.entries)
                .map(entry => entry.join("="))
                .join("&");
            const url = `${this.url}q=${state.filters.searchTerm}&${URLOptions}`;
            return url;
        },
        createDetailURL: function () {
            const URLOptions = Object.entries(this.entries)
                .map(entry => entry.join("="))
                .join("&");
            const url = `${this.proxy}${this.url}r=${state.data.recipes[0].id}&${URLOptions}`;
            return url;
        },
        // Get new recipes from the api.
        get: function (url) {
            const getData = new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest();
                request.open('GET', url, true)

                request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                        const dataResponse = data.parse(this.response);
                        resolve(dataResponse);
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
                const extracedData = data.extract(dataResponse);
                return extracedData;
            })
            .then(function (extracedData) {
                data.store(extracedData);
            })
            .then(function () {
                router.overviewPage();
            });
        },
        test: function () {
            api.get(api.createDetailURL());
        }
    };

    const data = {
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
                    id: hit.recipe.uri,
                    title: hit.recipe.label,
                    image: hit.recipe.image,
                    ingredients: hit.recipe.ingredientLines,
                    calories: (Math.round(hit.recipe.calories)),
                    healthLabels: hit.recipe.healthLabels,
                    totalWeight: hit.recipe.totalWeight
                };
            });
        },
        // Store the recipes in the temporary object.
        store: function (recipeData) {
            state.data.searchTerm = state.filters.searchTerm;

            recipeData.forEach(function (recipe) {
                state.data.recipes.push({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    ingredients: recipe.ingredients,
                    calories: recipe.calories,
                    healthLabels: recipe.healthLabels,
                    totalWeight: recipe.totalWeight
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

    // Render actor
    const render = {
        // Render the recipes on the screen.
        recipes: function () {
            state.data.recipes.forEach(function (recipe) {
                const recipeEl = document.createElement('article');
                recipeEl.classList = 'recipe';

                const imageEl = document.createElement('img');
                imageEl.src = recipe.image;
                imageEl.classList = 'recipe__img';

                const titleEl = document.createElement('h3');
                titleEl.textContent = recipe.title.length > 30 ? recipe.title.substring(0, 30) + '...' : recipe.title;
                titleEl.classList = 'recipe__title';

                dom.app.appendChild(recipeEl);
                recipeEl.appendChild(imageEl);
                recipeEl.appendChild(titleEl);
            });
        },
        // Clear the container.
        clear: function () {
            dom.app.innerHTML = ''; // Clear the search results.
        }
    };

    router.homePage();







    /* document.querySelector('#test').addEventListener('click', function(e) {
        e.preventDefault();
        api.test();
    }); */



})();