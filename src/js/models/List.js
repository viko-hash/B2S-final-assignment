import uniqid from 'uniqid';
export default class List {
	constructor() {
		this.ingItems = [];
	}

	addIngItem(count, unit, ingredient) {
		const ingItem = {
			id: uniqid(),
			count,
			unit,
			ingredient
		};
		this.ingItems.push(ingItem);
		return ingItem;
	}

	deleteIngItem(id) {
		const index = this.ingItems.findIndex((ingItem) => ingItem.id === id);
		this.ingItems.splice(index, 1);
	}
}
