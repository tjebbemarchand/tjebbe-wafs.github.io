'use strict';

// DOM
const app = document.querySelector('main');
const container = document.createElement('container');
container.classList = 'container';
const searchForm = document.querySelector('#searchForm');
const inputRecipeField = document.querySelector('#inputRecipe');
const searchRecipeBtn = document.querySelector('#searchRecipe');

app.appendChild(container);
container.setAttribute('class', 'container');

// APP
let recipes = [];

/* function loadRecipes() {
    const recipesJSON = localStorage.getItem('recipes');

    try {
        recipes = recipesJSON ? JSON.parse(recipesJSON) : [];
    } catch (e) {
        recipes = [];
    }
}; */


function renderRecipes(recipes) {
    recipes.forEach((recipe) => {
        const imageEl = document.createElement('img');
        imageEl.src = recipe.image;

        const titleEl = document.createElement('h2');
        titleEl.textContent = recipe.title;

        container.appendChild(imageEl);
        imageEl.insertAdjacentElement('afterend', titleEl);
    });
};

function searchRecipe(recipe) {
    container.innerHTML = ''; // Clear the search results.

    // API information
    const search = recipe;
    // const proxy = 'https://cors-anywhere.herokuapp.com/'
    const appID = 'c83b21f1';
    const appKey = 'f1e2173ac672d053a64913c59ad6932b';
    const url = `https://api.edamam.com/search?q=${search}&app_id=${appID}&app_key=${appKey}`;

    // API request
    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        const recipes = [];
        const data = JSON.parse(this.response);
        console.log(data);

        if (request.status >= 200 && request.status < 400) {
            data.hits.forEach(hit => {
                recipes.push({
                    title: hit.recipe.label,
                    image: hit.recipe.image,
                    ingredients: hit.recipe.ingredientLines,
                    calories: hit.recipe.calories
                });
            });
            console.log(recipes);
            renderRecipes(recipes);
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
    searchRecipe(inputRecipeField.value);
    inputRecipeField.value = '';
});