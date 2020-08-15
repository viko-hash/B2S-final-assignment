import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

// handle submit on search
const searchHandler = async () => {
	const searchInput = searchView.getInput();

	if (searchInput) {
		state.search = new Search(searchInput);

		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			await state.search.getRecipes();
			clearLoader();
			searchView.renderResults(state.search.recipes);
		} catch (err) {
			alert('Error occurred in search');
		}
	}
};

// search clicked
elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	searchHandler();
});

// pagination
elements.searchResPages.addEventListener('click', (e) => {
	const btnElement = e.target.closest('.btn-inline');
	if (btnElement) {
		const renderPage = parseInt(btnElement.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.recipes, renderPage);
	}
});

// recipe controller
const recipeController = async () => {
	const recipeId = window.location.hash.replace('#', '');

	if (recipeId) {
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		if (state.search) {
			searchView.highlightSelected(recipeId);
		}
		state.recipe = new Recipe(recipeId);
		try {
			await state.recipe.getIndividualRecipe();
			state.recipe.convertIngredients();
			clearLoader();
			recipeView.renderRecipe(state.recipe, false);
		} catch (error) {
			alert('Error occurred while fetching Recipe');
			console.log('Recipe Error: ', error);
		}
	}
};

window.addEventListener('hashchange', recipeController);
window.addEventListener('load', recipeController);

// increase/decrease functionality
elements.recipe.addEventListener('click', (e) => {
	if (e.target.matches('.btn-increase, .btn-increase *')) {
		state.recipe.updateServings('increase');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('decrease');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		listController();
	}
});

const listController = () => {
	if (!state.list) {
		state.list = new List();
	}
	state.recipe.ingredients.forEach((ingItem) => {
		const item = state.list.addIngItem(
			ingItem.count,
			ingItem.unit,
			ingItem.ingredient
		);
		listView.renderItem(item);
	});
};

// delete ingredient items
elements.shopping.addEventListener('click', (e) => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		state.list.deleteIngItem(id);
		listView.deleteItem(id);
	}
});
