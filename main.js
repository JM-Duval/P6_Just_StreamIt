
class Carousel {

	/**
	* @param {HTMLElement} element
	* @param {Object} options
	* @param {Object} options.slidesToScroll Nombre d'elements à faire defiler
	* @param {Object} options.slidesVisible Nombre d'elements visible dans un slide
	*/

	constructor (element, options = {}) {
		this.element = element;
		this.options = Object.assign({}, {
			slidesToScroll: 1,
			slidesVisible: 1
		}, options);
		let children = [].slice.call(element.children);
		this.currentItem = 0;	
		this.root = this.createDivWithClass('carousel');
		this.container = this.createDivWithClass('carousel__container');
		this.root.appendChild(this.container);
		this.element.appendChild(this.root);
		this.items = children.map((child) => {
			let item = this.createDivWithClass('carousel__item');
			item.appendChild(child);
			this.container.appendChild(item);
			return item;
		});
		this.setStyle();
		this.createNavigation();
	}

	/**
	 * Applique les bonnes dimensions aux éléments du carousel

	*/
	setStyle() {
		let ratio = (this.items.length / this.options.slidesVisible);
		this.container.style.width = (ratio * 100) + "%" ;
		this.items.forEach(item => item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%") ;
	}


	createNavigation () {
		let nextButton = this.createDivWithClass('carousel__next');
		let prevButton = this.createDivWithClass('carousel__prev');
		this.root.appendChild(nextButton);
		this.root.appendChild(prevButton);
		nextButton.addEventListener('click', this.next.bind(this));
		prevButton.addEventListener('click', this.prev.bind(this));
				
	}

	next () {
		this.gotoItem(this.currentItem + this.options.slidesToScroll)

	}

	prev () {
		this.gotoItem(this.currentItem - this.options.slidesToScroll)

	}


	/**
	 * deplace le carousel vers l'element ciblé
	 * @param {number} index
	*/
	gotoItem (index) {
		if (index < 0) {
			index = this.items.length - this.options.slidesVisible
		} else if (index >= this.items.length || this.items[this.currentItem + this.options.slidesVisible] === undefined) {
			index = 0
		}
		let translateX = index * -100 / this.items.length
		this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
		this.currentItem = index;
	}

	/**
	 *
	 * @param {string} className
	 * @returns {HTMLElement}
	 */

	createDivWithClass (className) {
		console.log('div created with class');
		let div = document.createElement('div');
		div.setAttribute('class', className);
		return div;
	}
}


// create carousel for each element with class name 'carousel'
let carousels = document.getElementsByClassName('carousel');
let nbCarousels = carousels.length;

while ( nbCarousels > 0) {
	let test = new Carousel (carousels[nbCarousels-1], {
		slidesToScroll: 1,
		slidesVisible: 4
	});
	nbCarousels --;
}


// get the modal
var modal = document.getElementById("myModal");

//get the buttin that opens the modal
var btns = document.getElementsByClassName("myBtn");

// get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// when the user click on buttton, open the modal
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(event) {
        let idEvent = event.target.id;
        console.log(event.target);
        modal.style.display = "block";

        const texteModal = document.getElementById('description_modal');

		getInfosMovies(idEvent).then(function (array) {
			var html = 'Title : ' + array['title'] + '<br>';
        	html += 'Genres : ' + array['genres'] + '<br>';
			html += 'Date published : ' + array['date_published'] + '<br>';
        	html += 'Rated : ' + array['rated'] + '<br>';
        	html += 'Imdb_score : ' + array['imdb_score'] + '<br>';
        	html += 'Writers : ' + array['writers'] + '<br>';
        	html += 'Actors : ' + array['actors'] + '<br>';
        	html += 'Duration : ' + array['duration'] + '<br>';
        	html += 'Countries : ' + array['countries'] + '<br>';
        	html += 'Budget : ' + array['budget'] + '<br>';
        	html += 'Description : ' + array['description'] + '<br>';
        	texteModal.innerHTML = html;
		});
    });
}



//when the user clicks on cross, close the modal
span.onclick = function() {
	modal.style.display = "none";
}

//when the user clicks anywhere of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

/**
 * @param {string} url
 * @returns {array} url des Movies
*/
		
const getUrlImages = async function(urlCategorie) {
	let response = await fetch(urlCategorie)
	if (response.ok) {	
		let data = await response.json();
		var nbMoviesPage1 = data.results.length;
		let nbMovies = 8;
		const map = new Map(); //map contains id & url img
		var i = 0;
		
		if (nbMoviesPage1 < nbMovies) {
			getInfosPage1();
			await getInfosPage2();	

		// situation if nbMoviesPage1 > nbMovies	
		} else {
			var i = 0;
			while (nbMovies > 0) {
				//array.push(result.image_url);
				idMovie = data.results[i].id;
				urlImage = data.results[i].image_url;
				map.set(idMovie, urlImage);
				nbMovies --;
				i ++;
			}
		}
		
		function getInfosPage1 () {
			data.results.forEach(function(res){
				//array.push(res.image_url);
				idMovie = data.results[i].id;
				urlImage = data.results[i].image_url;
				map.set(idMovie, urlImage);
				nbMovies --;
				i ++;
			});
				return map, nbMovies;
		}
		
		async function getInfosPage2 () {
			let responseNextPage = await fetch(data.next)
			if (responseNextPage.ok) {	
				let dataNextPage = await responseNextPage.json();
				let resultsNextPage = dataNextPage.results;
				var i = 0;
				while (nbMovies > 0) {
					//array.push(resultsNextPage[i].image_url);
					idMovie = resultsNextPage[i].id;
					urlImage = resultsNextPage[i].image_url;
					map.set(idMovie, urlImage);

					nbMovies --;
					i ++;
				};
				return map;
			} else {
				console.error('Retour du serveur: ', response.status)
			}
		}
		
		return map;
	} else {
			console.error('Retour du serveur: ', response.status)
	}
}


/**
 * @param {string} url
 * @param {string} index
 * @returns {array} informations about movie
*/


const getInfosMovies = async function(id_movie) {
	const urlSite = 'http://localhost:8000/api/v1/titles/';
	var urlMovie = urlSite + id_movie;
	let response = await fetch(urlMovie)
	if (response.ok) {	
		let data = await response.json();
		var infosArray = {};
		infosArray.title = data.title;
		infosArray.genres = data.genres;
		infosArray.date_published = data.date_published;
		infosArray.rated = data.rated;
		infosArray.imdb_score = data.imdb_score;
		infosArray.writers = data.writers;
		infosArray.actors = data.actors;
		infosArray.duration = data.duration;
		infosArray.countries = data.countries;
		infosArray.budget = data.budget;
		infosArray.description = data.description;		
		return infosArray;
	} else {
		console.error('Retour du serveur: ', response.status)
	}
}

// get information about best movie
const linksInfosBestMovie = async function (url) {
	let response = await fetch(url)
	if (response.ok) {	
		let data = await response.json();
		urlMovie = data.results[0].url;
		let res = await fetch(urlMovie)
		if (res.ok) {
			let dataMovie = await res.json();
			var titleBestMovie = document.getElementById('title_best_movie');
			var descriptionBestMovie = document.getElementById('description_best_movie');
			titleBestMovie.innerHTML = dataMovie.title;
			description_best_movie.innerHTML = dataMovie.description;
			var elementBM = document.getElementById('best_movie');
			elementBM.id = dataMovie.id;
		} else {
		console.error('Retour du serveur: ', response.status)
		}
	} else {
		console.error('Retour du serveur: ', response.status)
	}
}

// link Url & Id Movies to element "img" 
function linksUrlToImg (categorie, url) {
	const imgs = document.getElementsByClassName(categorie);
	getUrlImages(url).then(function (map){
		var i = 0;
		for (let img of imgs) {
			// link url image to img[index]
			var urlImg = Array.from(map.values())[i];
			img.src = urlImg;
			// link id to img[index]
			var idImg = Array.from(map.keys())[i];
			img.id = idImg;
			i ++;
		}
});
}

// data
const urlBestMovies = 'http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains='
const urlCategorie1 = 'http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=History&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains='
const urlCategorie2 = 'http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Comedy&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains='
const urlCategorie3 = 'http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Mystery&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains='


// Only for BestMovie, links description & title to element best movie 
linksInfosBestMovie(urlBestMovies);


// links img to url test
linksUrlToImg('best_movies', urlBestMovies);
linksUrlToImg('categorie_1', urlCategorie1);
linksUrlToImg('categorie_2', urlCategorie2);
linksUrlToImg('categorie_3', urlCategorie3);


