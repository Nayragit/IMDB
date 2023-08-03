const searchInput = document.getElementById("searchInput");
const mainContent = document.getElementById("mainContent");
const showFavBtn = document.getElementById("showFavBtn");
const apiKey = "243c0794";
let isFavOpen = false;
let previousResults;

const fetchSearchResults = async (searchTerm) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`
  );
  const data = await response.json();
  return data.Search;
};

const handleDetailClick = (movieId) => async () => {
  const data = await fetchMovieDetails(movieId);
  displayMovieDetails(data);
};

const displaySearchResults = (results) => {
  mainContent.innerHTML = ""; // Clear previous search results

  if (results && results.length > 0) {
    results.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie");

      const title = document.createElement("h2");
      title.textContent = movie.Title;

      const favoriteButton = document.createElement("button");
      if (isInFav(movie.imdbID)) {
        favoriteButton.textContent = "Remove from Favorites";
        favoriteButton.addEventListener("click", () => {
          removeFromFavorites(movie.imdbID);
        });
      } else {
        favoriteButton.textContent = "Add to Favorites";
        favoriteButton.addEventListener("click", () => {
          addToFavorites(movie);
        });
      }

      const detailsButton = document.createElement("button");
      detailsButton.textContent = "Details";
      detailsButton.addEventListener("click", handleDetailClick(movie.imdbID));

      movieElement.appendChild(title);
      movieElement.appendChild(favoriteButton);
      movieElement.appendChild(detailsButton);

      mainContent.appendChild(movieElement);
    });
  } else {
    mainContent.textContent = "No results found.";
  }
};

const fetchMovieDetails = async (movieId) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`
  );
  const data = await response.json();
  return data;
};

const getBackBtn = () => {
  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.addEventListener("click", () => {
    displaySearchResults(previousResults);
    showFavBtn.style.display = "block";
    isFavOpen = false;
  });
  return backButton;
};

const displayMovieDetails = (movie) => {
  mainContent.innerHTML = "";

  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-details");

  const title = document.createElement("h2");
  title.textContent = movie.Title;

  const poster = document.createElement("img");
  poster.src = movie.Poster;

  const plot = document.createElement("p");
  plot.textContent = movie.Plot;

  const backButton = getBackBtn();

  movieElement.appendChild(title);
  movieElement.appendChild(poster);
  movieElement.appendChild(plot);

  mainContent.appendChild(movieElement);
  mainContent.appendChild(backButton);
};

const isInFav = (id) => {
  const favorites = getFavorites();
  return favorites.some((favorite) => favorite.imdbID === id);
};

const addToFavorites = async (movie) => {
  const favorites = getFavorites();
  favorites.push(movie);
  saveFavorites(favorites);
  if (isFavOpen) {
    handleShowFav();
  } else {
    const data = {
      target: {
        value: searchInput.value
      }
    };
    await searchInputHandler(data);
  }
};

const removeFromFavorites = async (id) => {
  const favorites = getFavorites();
  const newFav = favorites.filter((fav) => fav.imdbID !== id);
  saveFavorites(newFav);
  if (isFavOpen) {
    handleShowFav();
  } else {
    const data = {
      target: {
        value: searchInput.value
      }
    };
    await searchInputHandler(data);
  }
};

const getFavorites = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const searchInputHandler = async (e) => {
  const response = await fetchSearchResults(e.target.value);
  previousResults = response;
  displaySearchResults(response);
};

const handleShowFav = () => {
  isFavOpen = true;
  showFavBtn.style.display = "none";
  const favorites = getFavorites();
  displaySearchResults(favorites);
  const backButton = getBackBtn();
  mainContent.appendChild(backButton);
};

showFavBtn.addEventListener("click", handleShowFav);
searchInput.addEventListener("input", searchInputHandler);
