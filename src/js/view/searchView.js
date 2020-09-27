import { elements } from './base';

// When arrorw function is 1 line it is implicit return 
// Will automatically return the value
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    // We wrapped this into brackets insted of single line
    // A single line fun automatically returns that we dont want here 
    elements.searchInput.value = '';
};

export const clearResults = () => {
    // to delete li elements of previous search
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    
    // Here we are actually adding things in an array which is
    // not changing the underlying variable thats why we can use const here
    // same can be done with objs
    const newTitle = [];

    // First check if length of text is longer than limit not
    if (title.length > limit) {
        // Split title which gives an array then using reduce bass callback fun
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit ) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        // reduce has a acc by default
        // acculumator starts from 0

        // return result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    //href=#23456 is the id for recipe
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt=${limitRecipeTitle(recipe.title)}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};
// type: 'prev' or 'next' | data-goto to go to a specific page
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    // pages > 1 as no bunntons for page < 1
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
            button = `
                ${createButton(page, 'next')}
                ${createButton(page, 'prev')}
            `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);  

};

export const renderResults = (recipes, pages = 1, resPerPage = 10) => {
    // render results of current page
    const start = (pages - 1) * resPerPage;
    const end = pages * resPerPage;

    // Call render recipe for each recipe
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(pages, recipes.length, resPerPage);
};