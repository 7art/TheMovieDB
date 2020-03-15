const movieDB = (function() {
  const rootDOMElement = document.getElementById("root");
  const listMoviesDOMElement = document.getElementById("list-movies");
  const movieDOMElement = document.getElementById("movie");
  const searchInputDOMElement = document.getElementById("search-movie");
  const searchBtnDOMElement = document.getElementById("search-btn");
  const progressDOMElement = document.getElementById("progress");

  const baseUrl = "https://api.themoviedb.org/3";
  const apiKeyUrl = "?api_key=47758b3f5eeb4ced7c77cebb1bbf3572";
  const searchUrl = "/search/movie";
  const trandingUrl = "/trending/all/day";
  const movieUrl = "/movie/";
  const recommendationsUrl = "/recommendations";
  const languageUrl = "&language=en-US";
  const imgUrl = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/";

  const recommendationsMaxCount = 10;
  let recommendationsListMovies = "";
  let search = false;

  function fetchData(url, showFunc) {    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        showFunc(data);       
      });
  }

  function fetchMovies() {
    let url = `${baseUrl}${trandingUrl}${apiKeyUrl}${languageUrl}`;
    search = false;
    fetchData(url, showMoviesList);
  }

  function fetchMovie(id) {
    let url = `${baseUrl}${movieUrl}${id}${apiKeyUrl}`;
    fetchRecommendationsMovie(id);
    setTimeout(() => {
      fetchData(url, showMovie);
    }, 1000);
    searchInputDOMElement.value = "";
    listMoviesDOMElement.innerHTML = "";
  }

  function fetchRecommendationsMovie(id) {
    let url = `${baseUrl}${movieUrl}${id}${recommendationsUrl}${apiKeyUrl}`;
    fetchData(url, showRecommendationsMovie);
  }

  function searchMovie(filmName) {
    let url = `${baseUrl}${searchUrl}${apiKeyUrl}&query=${filmName}&page=1`;
    movieDOMElement.innerHTML = "";
    search = true;
    setTimeout(() => {
      fetchData(url, showMoviesList);
    }, 1000);
  }

  function handlerSearch() {
    progressDOMElement.classList.remove("hide");
    searchInputDOMElement.value && searchMovie(searchInputDOMElement.value);
  }

  function showMoviesList(data) {
    let listMovies = `<p class="subtitle">${
      search ? "Movie Results" : "Tranding Movies"
    } </p><div class="list is-hoverable">`;
    if (data.total_results !== 0) {
      data.results.forEach(item => {
        listMovies += `<a class="list-item" data-id="${item.id}">
      ${item.title || item.name}</a>`;
      });
    } else {
      listMovies += `<p class="has-text-centered">There are no movies that matched your query.</p>`;
    }
    listMovies += `</div>`;
    progressDOMElement.classList.add("hide");
    listMoviesDOMElement.innerHTML = listMovies;
  }

  function showRecommendationsMovie(data) {
    recommendationsListMovies = "";
    let items =
      data.total_results > 10
        ? data.results.slice(0, recommendationsMaxCount)
        : data.results;

    items.forEach(item => {
      recommendationsListMovies += `<a data-id="${item.id}">${
        item.title
      }</a><br>`;
    });
  }

  function showMovie(movie) {
    let filmCard = `<div class="columns is-mobile">
    <div class="column is-offset-one-quarters-mobile is-offset-one-quarters-tablet is-4-desktop is-offset-one-third-desktop">
      <div class="card">
        <header class="card-header">
        <p class="card-header-title">
        ${movie.title}
        </p>  
        </header>
        <div class="card-image">
          <figure class="image is-2by3">
            ${
              movie.poster_path
                ? `<img src="${imgUrl}${movie.poster_path}" alt="${
                    movie.title
                  }">`
                : `<p class="has-text-centered">No poster</p>`
            }
          </figure>
        </div>
        <div class="card-content">
          <div class="content has-text-justified">
          ${movie.overview}    
          </div>
          <hr>
          <p class="subtitle">
          Recommendations:
          </p>
          ${recommendationsListMovies ||
            `<p class="has-text-centered">No recommendations</p>`}
        </div>
      </div>
    </div>
  </div> <br />
  <a class="button is-normal" href="index.html">Back</a>`;
    progressDOMElement.classList.add("hide");
    movieDOMElement.innerHTML = filmCard;
  }

  function initMovieBD() {
    progressDOMElement.classList.remove("hide");
    fetchMovies();
    rootDOMElement.addEventListener("click", e => {
      progressDOMElement.classList.remove("hide");
      let filmId = e.target.getAttribute("data-id");
      filmId && fetchMovie(filmId);
    });
    searchBtnDOMElement.addEventListener("click", () => {
      handlerSearch();
    });
    searchInputDOMElement.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        handlerSearch();
      }
    });
  }
  return {
    initMovieBD
  };
})();

movieDB.initMovieBD();
