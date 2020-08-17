export default class Likes {
	constructor() {
		this.likes = [];
	}

	addLikes(id, img, author, title) {
		const like = { id, img, author, title };
		this.likes.push(like);
		this.setLocalStorage();
		return like;
	}

	deleteLikes(id) {
		const index = this.likes.findIndex((item) => item.id === id);
		this.likes.splice(index, 1);
		this.setLocalStorage();
	}

	isLiked(id) {
		const isLiked = this.likes.findIndex((item) => item.id === id);
		return isLiked !== -1;
	}

	getRecipeLikes() {
		return this.likes.length;
	}

	setLocalStorage() {
		localStorage.setItem('likedRecipes', JSON.stringify(this.likes));
	}

	getLocalStorage() {
		const storage = JSON.parse(localStorage.getItem('likedRecipes'));
		if (storage) {
			this.likes = storage;
		}
	}
}
