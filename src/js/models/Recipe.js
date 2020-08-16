import axios from 'axios';

export default class Recipe {
	constructor(recipeId) {
		this.recipeId = recipeId;
	}

	async getIndividualRecipe() {
		try {
			const response = await axios.get(
				`https://forkify-api.herokuapp.com/api/get?rId=${this.recipeId}`
			);

			this.title = response.data.recipe.title;
			this.ingredients = response.data.recipe.ingredients;
			this.author = response.data.recipe.publisher;
			this.img = response.data.recipe.image_url;
			this.url = response.data.recipe.source_url;
			this.time = 30;
			this.servings = 2;
		} catch (error) {
			console.log('Recipe API error: ', error);
		}
	}

	convertIngredients() {
		const originalUnits = [
			'ounces',
			'ounce',
			'tablespoons',
			'tablespoon',
			'teaspoons',
			'teaspoon',
			'cups',
			'pounds'
		];
		const convertedUnits = [
			'oz',
			'oz',
			'tbsp',
			'tbsp',
			'tsp',
			'tsp',
			'cup',
			'pound'
		];

		const newIngredients = this.ingredients.map((ingItem) => {
			let ingredient = ingItem.toLowerCase();
			originalUnits.forEach((unit, index) => {
				ingredient = ingredient.replace(unit, convertedUnits[index]);
			});

			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			const ingArray = ingredient.split(' ');
			const ingUnitIndex = ingArray.findIndex((item) =>
				convertedUnits.includes(item)
			);

			let ingObject;
			if (ingUnitIndex > -1) {
				const arrCount = ingArray.slice(0, ingUnitIndex);
				let count;
				if (arrCount.length === 1) {
					count = eval(ingArray[0].replace('-', '+'));
				} else {
					count = eval(ingArray.slice(0, ingUnitIndex).join('+'));
				}
				ingObject = {
					count,
					unit: ingArray[ingUnitIndex],
					ingredient: ingArray.slice(ingUnitIndex + 1).join(' ')
				};
			} else if (parseInt(ingArray[0], 10)) {
				ingObject = {
					count: parseInt(ingArray[0], 10),
					unit: '',
					ingredient: ingArray.slice(1).join(' ')
				};
			} else if (ingUnitIndex === -1) {
				ingObject = {
					count: 1,
					unit: '',
					ingredient
				};
			}
			return ingObject;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		const updatedServings =
			type === 'increase' ? this.servings + 1 : this.servings - 1;
		this.ingredients.forEach((ingredient) => {
			ingredient.count = ingredient.count * (updatedServings / this.servings);
		});

		this.servings = updatedServings;
	}
}
