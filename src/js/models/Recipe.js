import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assume for every Ingredient time = 15 min
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        // To change units into a standard / Uniform format 
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; // ... Used to destructure -> will be replaced with array elements

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units | converting all to lowercase to reduce cases
            let ingredient= el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                // If we find a longunit we replace it with short unit of i position
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3) Parse ingredients into count,  unit and ingredient
            const arrIng = ingredient.split(' ');

            // Way to find the position of the unit whne we dont know what we are looking for
            // Includes returns true or false based on if it found the element
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval("4+1/2") ---> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    // + removes extra 0
                    count = +eval(arrIng[0].replace('-','+')).toFixed(2);
                } else {
                    count = +eval(arrIng.slice(0, unitIndex).join('+')).toFixed(2);
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit , but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // slice(1) means start from 1 to end
                }
            } else if (unitIndex === -1) {
                // There is NO unit
                objIng = {
                    // Tomato sauce w/o ingredient = 1 tomato sauce
                    count: 1,
                    unit: '',
                    ingredient // same as ingredient: ingredient; | ES6 feature
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) { // inc and dec
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });

        this.servings = newServings;
    }
}