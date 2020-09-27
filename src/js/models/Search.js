import axios from 'axios';

// Using default as we only need to return 1 thing
export default class Search {
    // Whenever create a class we should also create a constructor
    constructor(query) {
        this.query = query;
    }

    
// No need to add function keyword (async function) when using inside class
    async getResults() {
        try {
            // await waits for request answer
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            // Using this. saves the result in the object itself
            this.result = res.data.recipes;
            //console.log(this.result);

        } catch (error){
            alert(error);
        }
    }
}