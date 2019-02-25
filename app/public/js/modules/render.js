'use strict';

/* beautify preserve:start */
import { dom } from './dom.js';
import { state } from './state.js';
import { api } from './api.js';
import { router } from './router.js';
import { data } from './data.js';
/* beautify preserve:end */

// Render actor
export const render = {
    homePage: function () {
        dom.app.classList.add('homepage-background');
        const homePage = `
            <form id="searchForm">
                <h2>Search for any type of recipe</h2>
                <input placeholder="Search for any recipe" type="text" name="inputRecipe" id="inputRecipe">
                <button name="searchRecipe" class="search-recipe">Search recipe</button>
            </form>
        `;

        render.clearBackBtn();
        dom.app.insertAdjacentHTML('afterbegin', homePage);
        
        document.querySelector('.search-recipe').addEventListener('click', function (e) {
            e.preventDefault();
            const input = document.querySelector('#inputRecipe').value;
            if(input !== '') {
                render.clear();
                render.renderLoader();
                state.data.searchTerm = input.toLowerCase();
                // data.load();
                api.get();
            }
        });
    },
    overviewPage: function () {
        render.clear();
        render.clearBackBtn();
        render.renderBackBtn('homePage');        
        render.clearLoader();

        this.documentTitle(`Recipe searcher - ${state.data.searchTerm}`);

        const title = document.createElement('h1');
        title.classList = 'search-results-title';
        title.textContent = `Search results for: ${state.data.searchTerm}`;
        dom.app.appendChild(title);
        
        const recipeContainer = document.createElement('section');
        recipeContainer.classList = 'recipe-container';
        dom.app.appendChild(recipeContainer);

        state.data.recipes.forEach(function (recipe) {
            const recipeEl = `
                <a href="#${recipe.recipe__id}" class="recipe__link">
                    <article class="recipe-thumb">
                        <img src="${recipe.recipe__image}" class="recipe-thumb__recipe-img">
                        <h3 class="recipe-thumb__recipe-title">${recipe.recipe__title.length > 20 ? recipe.recipe__title.substring(0, 20) + '...' : recipe.recipe__title}</h3>
                    </article>
                </a>
            `;
            recipeContainer.insertAdjacentHTML('beforeend', recipeEl);
        });
        
        const recipeLinks = document.querySelectorAll('.recipe__link');
        recipeLinks.forEach(function (recipeLink) {
            recipeLink.addEventListener('click', function (e) {
                e.preventDefault();
                const id = e.currentTarget.hash.split('#')[1];
                router.detailPage(id);
            });
        });
    },
    detailPage: function (id) {
        render.clearBackBtn();
        render.renderBackBtn('overviewPage');

        // MOVE TO ROUTER OBJECT.
        const recipe = state.data.recipes.find(function (recipe) {
            return recipe.recipe__id === id;
        });

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

        dom.app.insertAdjacentHTML('afterbegin', recipeEl);
    },
    documentTitle: function(title) {
        document.title = title;
    },
    // Clear the container.
    clear: function () {
        if(dom.app.classList.contains('homepage-background')) dom.app.classList.remove('homepage-background');
        while (dom.app.hasChildNodes()) {
            dom.app.removeChild(dom.app.firstChild);
        }
    },
    renderBackBtn: function(page) {
        const backBtn = `<img class="page-back" src="../../../public/img/back-arrow.svg">`;
        dom.body.insertAdjacentHTML('afterbegin', backBtn);

        dom.body.querySelector('.page-back').addEventListener('click', function(e) {
            e.preventDefault();
            
            switch(page) {
                case 'overviewPage':
                  router.overviewPage();
                  break;
                case 'homePage':
                    router.homePage();
                    break;
            }
        });
    },
    clearBackBtn: function() {
        const backBtn = document.querySelector('.page-back');
        if(backBtn) backBtn.parentElement.removeChild(backBtn);
    },
    renderLoader: function () {
        const loader = `
            <div class="loader">
                <svg viewBox="0 0 456 488" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421">
                <g fill="#cc8718" fill-rule="nonzero">
                <path d="M39.323 203.641c15.664 0 29.813-9.405 35.872-23.854 25.017-59.604 83.842-101.61 152.42-101.61 37.797 0 72.449 12.955 100.23 34.442l-21.775 3.371c-7.438 1.153-13.224 7.054-14.232 14.512-1.01 7.454 3.008 14.686 9.867 17.768l119.746 53.872c5.249 2.357 11.33 1.904 16.168-1.205 4.83-3.114 7.764-8.458 7.796-14.208l.621-131.943c.042-7.506-4.851-14.144-12.024-16.332-7.185-2.188-14.947.589-19.104 6.837l-16.505 24.805C354.398 26.778 294.1 0 227.615 0 126.806 0 40.133 61.562 3.167 149.06c-5.134 12.128-3.84 26.015 3.429 36.987 7.269 10.976 19.556 17.594 32.727 17.594zM448.635 301.184c-7.27-10.977-19.558-17.594-32.728-17.594-15.664 0-29.813 9.405-35.872 23.854-25.018 59.604-83.843 101.61-152.42 101.61-37.798 0-72.45-12.955-100.232-34.442l21.776-3.369c7.437-1.153 13.223-7.055 14.233-14.514 1.009-7.453-3.008-14.686-9.867-17.768L33.779 285.089c-5.25-2.356-11.33-1.905-16.169 1.205-4.829 3.114-7.764 8.458-7.795 14.207l-.622 131.943c-.042 7.506 4.85 14.144 12.024 16.332 7.185 2.188 14.948-.59 19.104-6.839l16.505-24.805c44.004 43.32 104.303 70.098 170.788 70.098 100.811 0 187.481-61.561 224.446-149.059 5.137-12.128 3.843-26.014-3.425-36.987z"/>
                </g>
                </svg>
            </div>
        `;
        dom.app.insertAdjacentHTML('afterbegin', loader);
    },
    clearLoader: function() {
        const loader = document.querySelector('.loader');
        if(loader) loader.parentElement.removeChild(loader);
    }
};

/* export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        // Split the sentence into an array.
        title.split(' ').reduce((acc, cur) => {
            // Push the new word into a new array if it's not bigger then 17.
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        
        // Return the result.
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}; */

// RENDER TEMPLATE
/* const recipeLink = document.createElement('a');
recipeLink.classList = 'recipe__id';
dom.app.appendChild(recipeLink);

const recipeArticle = document.createElement('article');
recipeArticle.classList = 'recipe';
recipeLink.appendChild(recipeArticle);

const recipeImage = document.createElement('img');
recipeImage.classList = 'recipe__image';
recipeArticle.appendChild(recipeImage);

const recipeTitle = document.createElement('h3');
recipeTitle.classList = 'recipe__title';
recipeArticle.appendChild(recipeTitle);

const directives = {
    // recipe__id: {
    //     href: function () {
    //         return "/#" + this.recipe__id;
    //     }
    // },
    recipe__image: {
        src: function () {
            return this.recipe__image;
        }
    }
};

Transparency.render(dom.app, state.data.recipes, directives); */