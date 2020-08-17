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

let initialRecipes = [
	{
		image_url:
			'http://forkify-api.herokuapp.com/images/best_pizza_dough_recipe1b20.jpg',
		publisher: '101 Cookbooks',
		publisher_url: 'http://www.101cookbooks.com',
		recipe_id: '47746',
		social_rank: 100,
		source_url: 'http://www.101cookbooks.com/archives/001199.html',
		title: 'Best Pizza Dough Ever'
	},
	{
		image_url: 'http://forkify-api.herokuapp.com/images/fruitpizza9a19.jpg',
		publisher: 'The Pioneer Woman',
		publisher_url: 'http://thepioneerwoman.com',
		recipe_id: '46956',
		social_rank: 100,
		source_url: 'http://thepioneerwoman.com/cooking/2012/01/fruit-pizza/',
		title: 'Deep Dish Fruit Pizza'
	}
];

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
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(recipeId));
		} catch (error) {
			alert('Error occurred while fetching Recipe');
			console.log('Recipe Error: ', error);
		}
	} else {
		searchView.renderResults(initialRecipes);
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
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		likeController();
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

// like controller
const likeController = () => {
	if (!state.likes) {
		state.likes = new Likes();
	}
	const currentRecipeId = state.recipe.recipeId;

	if (!state.likes.isLiked(currentRecipeId)) {
		const newLike = state.likes.addLikes(
			currentRecipeId,
			state.recipe.img,
			state.recipe.author,
			state.recipe.title
		);
		likesView.toggleLikeBtn(true);
		likesView.renderLike(newLike);
	} else {
		state.likes.deleteLikes(currentRecipeId);
		likesView.toggleLikeBtn(false);
		likesView.deleteLike(currentRecipeId);
	}
	likesView.toggleLikeMenu(state.likes.getRecipeLikes());
};

// localstorage
window.addEventListener('load', () => {
	state.likes = new Likes();
	state.likes.getLocalStorage();
	likesView.toggleLikeMenu(state.likes.getRecipeLikes());
	state.likes.likes.forEach((like) => likesView.renderLike(like));
});
