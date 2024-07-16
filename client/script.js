// API key
const apiKey = 'f848503519b5454ea2f9f4be1ca180c8';

// Add an event listener for search input
document.getElementById('search-input').addEventListener('keyup', async (event) => {
    // Check if the key is Enter
    if (event.key === 'Enter') {
        // Search for movies based on the query
        const searchQuery = event.target.value;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`);
        // Parse the response
        const data = await response.json();
        
        // Clear content in the movie list container
        const movieList = document.getElementById('movie-list');
        movieList.innerHTML = '';
        
        // Check the results from the API
        if (data.results.length > 0) {
            displayMovies(data.results);
        } else {
            movieList.innerHTML = '<p>Movies not found</p>';
        }
    }
});

/**
 * Fetch and display the most popular movies from API.
 * This function makes request to the API to take the
 * list of popular movies.
 */
async function updatePopMovies() {
    try {
        // Request to API for popular movies
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        // Check if the response
        if (!response.ok) {
            throw new Error('Network response was bad');
        }
        // Parse the data
        const data = await response.json();
        // Log the data and call the displayMovies
        console.log('Popular Movies:', data);
        displayMovies(data.results);
    } catch (error) {
        // Log errors
        console.error('Fetch error:', error); 
    }
}

/**
 * Display the movies.
 * This function takes an array of movie objects and creates HTML elements to
 * display each movie
 *
 * @param {Array} movies - Movie objects to be displayed.
 * @returns {void}
 */
function displayMovies(movies) {
    // Clear content in the movie list container
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    
    // Iterate each movie in the array
    movies.forEach(movie => {
        // Create a element for movie item
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        const releaseDate = new Date(movie.release_date);
        const movieDate = releaseDate.toLocaleString('en-US', {
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
        });

         // Set the inner HTML of the movie item
        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movieDate}</p>
        `;

        // Add an event listener to redirect to movie page
        movieItem.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });
        // Append the movie item
        movieList.appendChild(movieItem);
    });
}

document.addEventListener('DOMContentLoaded', updatePopMovies);


