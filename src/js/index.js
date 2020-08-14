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
