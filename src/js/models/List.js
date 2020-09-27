import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, // Same as count: count
            unit,
            ingredient
        } 
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // element id which matches passed id
        const index = this.items.findIndex(el => el.id === id);

        // [2, 4, 8] splice(1,2) > returns [4, 8], original array [2]
        // [2, 4, 8] slice(1,2) > returns 4, original array [2, 4 ,8]
        this.items.splice(index, 1)
    }

    updateCount(id, newCount) {
        // find to find the element -> returns el -> el.count = newCount;
        this.items.find(el => el.id === id).count = newCount;
    }
}

