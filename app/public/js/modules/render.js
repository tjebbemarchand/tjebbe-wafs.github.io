'use strict';

import { app } from './app.js';
import { data } from './data.js';
import { api } from './api.js';

// Export object - render.
export const render = {
    // Render homePage function.
    homePage: function () {
        app.dom.app.classList.add('homepage-background'); // Give the main a class for the background.

        // Create HTML
        const homePage = `
            <form id="searchForm">
                <h2>Search for any type of recipe</h2>
                <input placeholder="Search for any recipe" type="text" name="inputRecipe" id="inputRecipe">
                <button name="searchRecipe" class="search-recipe">Search recipe</button>
            </form>
        `;

        app.dom.app.insertAdjacentHTML('afterbegin', homePage); // Insert HTML into the DOM.
        
        // Create an event listener for the search recipe button.
        document.querySelector('.search-recipe').addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the page fron loading.
            const input = document.querySelector('#inputRecipe').value.toLowerCase(); // Get the input.

            // If there is an input.
            if(input !== '') {
                window.location.hash = `/overviewPage/${input}`; // Change the hash with the input.
            }
        });
    },
    overviewPage: function (recipes = app.state.data.recipes) {
        this.documentTitle(`Recipe searcher - ${api.entries.q}`);

        const title = document.createElement('h1');
        title.classList = 'search-results-title';
        title.textContent = `Search results for: ${api.entries.q}`;
        app.dom.app.appendChild(title);
        
        const recipeContainer = document.createElement('section');
        recipeContainer.classList = 'recipe-container';
        app.dom.app.appendChild(recipeContainer);

        // Filter input
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Filter search results';
        filterInput.classList = 'filter-search-results';

        const filterInputReset = document.createElement('button');
        filterInputReset.innerHTML = 'Reset filter';
        filterInputReset.classList = 'filter-search-results-reset';

        // Sort buttons
        const filterEl = document.createElement('div');
        filterEl.classList = 'recipe-filters';

        const sortBtn1 = document.createElement('button');
        sortBtn1.type = 'button';
        sortBtn1.classList = 'sort-by-title__a-z'
        sortBtn1.innerHTML = 'Sort by title (a - z)';
        
        const sortBtn2 = document.createElement('button');
        sortBtn2.type = 'button';
        sortBtn2.classList = 'sort-by-title__z-a'
        sortBtn2.innerHTML = 'Sort by title (z - a)';

        // Render elements on the screen
        recipeContainer.appendChild(filterEl);
        filterEl.appendChild(filterInput);
        filterEl.appendChild(filterInputReset);
        filterEl.appendChild(sortBtn1);
        filterEl.appendChild(sortBtn2);

        recipes.forEach(function (recipe) {
            const recipeEl = `
                <a href="#${recipe.recipe__id}" class="recipe__link">
                    <article class="recipe-thumb">
                        <img src="${recipe.recipe__image}" class="recipe-thumb__recipe-img">
                        <h3 class="recipe-thumb__recipe-title">${render.limitRecipeTitle(recipe.recipe__title)}</h3>
                    </article>
                </a>
            `;

            recipeContainer.insertAdjacentHTML('beforeend', recipeEl);
        });

        filterInput.addEventListener('change', async function(e) {
            e.preventDefault();
            const filteredData = await data.filter(e.target.value);
            await render.clear();
            render.overviewPage(filteredData);
        });
        
        filterInputReset.addEventListener('click', async function(e) {
            e.preventDefault();
            await render.clear();
            render.overviewPage();
        });

        sortBtn1.addEventListener('click', async function(e) {
            e.preventDefault();
            const sortedData = await data.sort('alphabetically', app.state.data.recipes);
            debugger;
            await data.store(sortedData);
            await render.clear();
            render.overviewPage();
        });

        sortBtn2.addEventListener('click', async function(e) {
            e.preventDefault();
            const sortedData = await data.sort('reverse-alphabetically', app.state.data.recipes);
            await data.store(sortedData);
            await render.clear();
            render.overviewPage();
        });

        const recipeLinks = document.querySelectorAll('.recipe__link');
        recipeLinks.forEach(function (recipeLink) {
            recipeLink.addEventListener('click', function (e) {
                e.preventDefault();
                const id = e.currentTarget.hash.split('#')[1];
                window.location.hash = `/detailPage/${id}`;
            });
        });
    },
    detailPage: function (recipe) {
        const recipeEl = `
            <div class="recipe-details">
                <div class="recipe-details__image-container">
                    <img class="recipe-details__image" src="${recipe.recipe__image}">
                </div>
                <div class="recipe-details__content">
                    <h1 class="recipe-details__title">${recipe.recipe__title}</h1>
                    <div class="recipe-details__ingredients">
                        <h3 class="ingredients__title">Ingredients</h3>
                        <ul class="ingredients__list">
                            ${recipe.recipe__ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recipe-details__info">
                        <ul class="info__details">
                            <li>Calories: ${Math.round(recipe.recipe__calories)} kcal</li>
                            <li>Total weight: ${Math.round(recipe.recipe__totalWeight)} grams</li>
                        </ul>
                        <span>Source: ${recipe.recipe__source}</span>
                    </div>
                </div>
            </div>
        `;

        app.dom.app.insertAdjacentHTML('afterbegin', recipeEl);
    },
    limitRecipeTitle: function (title, limit = 20) {
        const newTitle = [];
        if (title.length > limit) {
            title.split(' ').reduce(function(acc, cur) {
                if (acc + cur.length <= limit) {
                    newTitle.push(cur);
                }
                return acc + cur.length;
            }, 0);
            return `${newTitle.join(' ')}...`;
        }
        return title;
    },
    documentTitle: function(title) {
        document.title = title;
    },
    // Clear the container.
    clear: function () {
        // Check if the main has a class. If so remove it.
        if(app.dom.app.classList.contains('homepage-background')) app.dom.app.classList.remove('homepage-background');

        // Check if the app has DOM elements.
        while (app.dom.app.hasChildNodes()) {
            app.dom.app.removeChild(app.dom.app.firstChild); // Remove every element.
        }
    },
    // Render the loader.
    renderLoader: function () {
        // Create HTML for the loader.
        const loader = `
            <div class="loader">
                <svg viewBox="0 0 456 488" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421">
                <g fill="#cc8718" fill-rule="nonzero">
                <path d="M39.323 203.641c15.664 0 29.813-9.405 35.872-23.854 25.017-59.604 83.842-101.61 152.42-101.61 37.797 0 72.449 12.955 100.23 34.442l-21.775 3.371c-7.438 1.153-13.224 7.054-14.232 14.512-1.01 7.454 3.008 14.686 9.867 17.768l119.746 53.872c5.249 2.357 11.33 1.904 16.168-1.205 4.83-3.114 7.764-8.458 7.796-14.208l.621-131.943c.042-7.506-4.851-14.144-12.024-16.332-7.185-2.188-14.947.589-19.104 6.837l-16.505 24.805C354.398 26.778 294.1 0 227.615 0 126.806 0 40.133 61.562 3.167 149.06c-5.134 12.128-3.84 26.015 3.429 36.987 7.269 10.976 19.556 17.594 32.727 17.594zM448.635 301.184c-7.27-10.977-19.558-17.594-32.728-17.594-15.664 0-29.813 9.405-35.872 23.854-25.018 59.604-83.843 101.61-152.42 101.61-37.798 0-72.45-12.955-100.232-34.442l21.776-3.369c7.437-1.153 13.223-7.055 14.233-14.514 1.009-7.453-3.008-14.686-9.867-17.768L33.779 285.089c-5.25-2.356-11.33-1.905-16.169 1.205-4.829 3.114-7.764 8.458-7.795 14.207l-.622 131.943c-.042 7.506 4.85 14.144 12.024 16.332 7.185 2.188 14.948-.59 19.104-6.839l16.505-24.805c44.004 43.32 104.303 70.098 170.788 70.098 100.811 0 187.481-61.561 224.446-149.059 5.137-12.128 3.843-26.014-3.425-36.987z"/>
                </g>
                </svg>
            </div>
        `;
        app.dom.app.insertAdjacentHTML('afterbegin', loader); // Insert HTML into the DOM.
    },
    clearLoader: function() {
        const loader = document.querySelector('.loader');
        if(loader) loader.parentElement.removeChild(loader);
    }
};