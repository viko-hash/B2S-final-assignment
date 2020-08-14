import axios from 'axios';

export default class Search {
	constructor(searchInput) {
		this.searchInput = searchInput;
	}

	async getRecipes() {
		try {
			const response = await axios.get(
				`https://forkify-api.herokuapp.com/api/search?q=${this.searchInput}`
			);
			this.recipes = response.data.recipes;
		} catch (error) {
			console.log('API Error: ', error);
		}
	}
}
