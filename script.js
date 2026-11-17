
const KEY = "3fd2be6f0c70a2a598f084ddfb75487c";

const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${KEY}&page=1`;

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

const main = document.getElementById("movie-container");
const form = document.getElementById("form");
const search = document.getElementById("search");

const getClassByRate = (vote) => {
    if (vote >= 7.5) return "green";
    else if (vote >= 7) return "orange";
    else return "red";
};

const showMovies = (movies) => {
    main.innerHTML = "";

    if (!movies || movies.length === 0) {
        main.innerHTML = `<h2 style="color:white;grid-column:1/-1;text-align:center;padding:50px 0">
            No Movies Found!
        </h2>`;
        return;
    }

    movies.forEach((movie) => {
        const {
            title,
            poster_path,
            vote_average,
            overview
        } = movie;

        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        const poster = poster_path
            ? IMG_PATH + poster_path
            : "https://placehold.co/500x750/171722/ffffff?text=No+Poster";

        movieElement.innerHTML = `
            <img src="${poster}" alt="${title || "Movie poster"}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">
                    ${Number(vote_average).toFixed(1)}
                </span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview || "No overview available."}
            </div>
        `;

        main.appendChild(movieElement);
    });
};

const getMovies = async (url) => {
    try {
        main.innerHTML = `<h2 style="color:white;grid-column:1/-1;text-align:center;padding:50px 0">
            Loading Movies...
        </h2>`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await res.json();

        showMovies(data.results);

    } catch (error) {
        console.log(error);

        main.innerHTML = `<h2 style="color:#ff5555;grid-column:1/-1;text-align:center">
            Something went wrong. Please try again!
        </h2>`;
    }
};

// Load popular movies
getMovies(API_URL);

// Search Movies
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm) {
        getMovies(SEARCH_API + encodeURIComponent(searchTerm));
        search.value = "";
    } else {
        getMovies(API_URL);
    }
});
