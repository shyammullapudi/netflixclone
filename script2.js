// API key from TMDB
const api = "api_key=0d7fcb538472b4a248392fdaf9ae8532";

// Base URL of the site
const base_url = "https://api.themoviedb.org/3";

const banner_url = "https://image.tmdb.org/t/p/original";
const img_url = "https://image.tmdb.org/t/p/w300"; // You can change "w185" to your preferred size

// Requests for movies data
const requests = {
  fetchTrending: `${base_url}/trending/all/week?${api}&language=en-US`,
  fetchNetflixOrignals: `${base_url}/discover/tv?${api}&with_networks=213`,
  fetchActionMovies: `${base_url}/discover/movie?${api}&with_genres=28`,
  fetchComedyMovies: `${base_url}/discover/movie?${api}&with_genres=35`,
  fetchHorrorMovies: `${base_url}/discover/movie?${api}&with_genres=27`,
  fetchRomanceMovies: `${base_url}/discover/movie?${api}&with_genres=10749`,
  fetchDocumentaries: `${base_url}/discover/movie?${api}&with_genres=99`,
};

// Used to truncate the string
function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// Fetch and display banner
fetch(requests.fetchNetflixOrignals)
  .then((res) => res.json())
  .then((data) => {
    if (data.results && data.results.length > 0) {
      const setMovie = data.results[Math.floor(Math.random() * data.results.length)];
      const banner = document.getElementById("banner");
      const banner_title = document.getElementById("banner__title");
      const banner_desc = document.getElementById("banner__description"); // Fixed the reference to banner_desc

      if (banner && banner_title && banner_desc) {
        banner.style.backgroundImage = `url(${banner_url}${setMovie.backdrop_path})`;
        banner_title.innerText = setMovie.name;
        banner_desc.innerText = truncate(setMovie.overview, 150);
      } else {
        console.error("Banner elements are missing from the DOM.");
      }
    } else {
      console.error("No results found for Netflix Originals.");
    }
  })
  .catch((error) => console.error("Error fetching Netflix Originals:", error));

// Function to fetch and display rows of movies
function fetchAndDisplayMovies(requestUrl, titleText) {
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const headrow = document.getElementById("headrow");
        if (headrow) {
          const row = document.createElement("div");
          row.className = "row";
          headrow.appendChild(row);

          const title = document.createElement("h2");
          title.className = "row__title";
          title.innerText = titleText;
          row.appendChild(title);

          const row_posters = document.createElement("div");
          row_posters.className = "row__posters";
          row.appendChild(row_posters);

          data.results.forEach((movie) => {
            const poster = document.createElement("img");
            poster.className = titleText === "NETFLIX ORIGINALS" ? "row_posterLarge" : "row_poster";
            poster.id = movie.id;
            poster.src = img_url + (movie.poster_path || movie.backdrop_path);
            row_posters.appendChild(poster);
          });
        } else {
          console.error("Headrow element is missing from the DOM.");
        }
      } else {
        console.error(`No results found for ${titleText}.`);
      }
    })
    .catch((error) => console.error(`Error fetching ${titleText}:`, error));
}

// Fetch and display various movie categories
fetchAndDisplayMovies(requests.fetchNetflixOrignals, "NETFLIX ORIGINALS");
fetchAndDisplayMovies(requests.fetchTrending, "Top Rated");
fetchAndDisplayMovies(requests.fetchActionMovies, "Action Movies");
fetchAndDisplayMovies(requests.fetchComedyMovies, "Comedy Movies");
fetchAndDisplayMovies(requests.fetchHorrorMovies, "Horror Movies");
fetchAndDisplayMovies(requests.fetchRomanceMovies, "Romance Movies");
fetchAndDisplayMovies(requests.fetchDocumentaries, "Documentaries");
