

const urlBestMovies = 'http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains='


const getUrlMovies = async function(url) {
	let response = await fetch(url)
	if (response.ok) {	
		let data = await response.json();
		var nbMoviesPage1 = data.results.length;
		let nbMovies = 8;
		var array = [];
		var i = 0;
	
		// itération sur la première page
		if (nbMoviesPage1 <= nbMovies) {
			data.results.forEach(function(result){
				array.push(result.image_url);
				i++;
				nbMovies --;
			})
		} else { 
			var i = 0;
			while (nbMovies > 0) {
				array.push(result.image_url);
				nbMovies --;
				i ++;
			}
		}
		
		// Itération sur la 2 ème page dans le cas ou nbMoviesPage1 <= nbMovies
		let responseNextPage = await fetch(data.next)
		if (responseNextPage.ok) {	
			let dataNextPage = await responseNextPage.json();
			let resultsNextPage = dataNextPage.results;
			//console.log(dataNextPage.results);
			var i = 0;
			while (nbMovies > 0) {
				array.push(resultsNextPage[i].image_url);
				nbMovies --;
				i ++;
			}
		} else {
			console.error('Retour du serveur: ', response.status)
		}
		return array;
	} else {
		console.error('Retour du serveur: ', response.status)
	}
}

// attribution des urlMovies aux id "img" 
const imgs = document.getElementsByTagName("img");

getUrlMovies(urlBestMovies).then(function (array){
	var i = 0; 
	for (let img of imgs) {
		img.src = array[i];
		i ++;
	}
});





// test pour récupérer le titre du premier film

//const titleTest = document.getElementsByTagName("txt");
const titleTest = document.querySelector("#txt");

fetch(urlBestMovies)
	.then(response => {
		if(response.ok){
			response.json().then(data => {
				titleTest.innerHTML = data.results[0].title;
			})
		} else {
			console.log("ERREUR");
			document.getElementById('erreur').innerHTML = "Erreur"
		}
	})



// test pour aller sur l'URL du film et récupérer ses infos

fetch(urlBestMovies)
	.then(function(response) {
		return response.json();
	})
	.then(function(data){
		//console.log(data.results[0].url);
		return data.results[0].url;
	})
	.then(function(test){
		fetch(test)
		.then(function(res) {
			return res.json();
		})
		.then(function(dataTest){
			console.log(dataTest.title);
			console.log(dataTest.genres);
			console.log(dataTest.date_published);
			console.log(dataTest.rated);
			console.log(dataTest.imdb_score);
			console.log(dataTest.writers);
			console.log(dataTest.actors);
			console.log(dataTest.duration);
			console.log(dataTest.countries);
			console.log(dataTest.budget);
			console.log(dataTest.description);
		})
	})


/*
L’image de la pochette du film
Le Titre du film : 			"title"
Le genre complet du film  : "genres"
Sa date de sortie : 		"date_published"
Son Rated : 				"rated"
Son score Imdb  : 			"imdb_score"
Son réalisateur  : 			"writers"
La liste des acteurs  : 	"actors"
Sa durée  : 				"duration "
Le pays d’origine			"countries"
Le résultat au Box Office	"budget"
Le résumé du film			"description"
*/