/**
 * This function retrieves and displays movie details from API based on the movie ID from the URL. 
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve the movie ID
    const urlnumber = new URLSearchParams(window.location.search);
    const movieID = urlnumber.get('id');
    const apiKey = 'f848503519b5454ea2f9f4be1ca180c8';
    
    // Retrieve the movie ID
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}&append_to_response=credits`);
    const movie = await response.json();
    
    // Display movie details
    document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-plot').innerText = movie.overview;
    document.getElementById('movie-rating').innerText = `Rating: ${movie.vote_average}`;
    document.getElementById('movie-release-date').innerText = `Release Date: ${movie.release_date}`;
    document.getElementById('movie-runtime').innerText = `Runtime: ${movie.runtime} minutes`;
    
    // Set the cast
    const cast = movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    document.getElementById('movie-cast').innerText = `Cast: ${cast}`;
    
     // Load reviews 
    loadReviews(movieID);
    
    // Set up the review
    document.getElementById('submit-review').onclick = () => submitReview(movieID);
});


/**
 * Fetches and displays user reviews.
 * 
 * @param {string} movieID - The ID of the movie.
 */
async function loadReviews(movieID) {
    // Fetch reviews
    const response = await fetch(`/reviews/${movieID}`);
    const reviews = await response.json();
    
    // Clear reviews
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
     // Iterate the reviews and create list items for each review
    reviews.forEach(review => {
        const reviewItem = document.createElement('li');
        reviewItem.classList.add('review-item');
        
         // Create a span element
        const reviewText = document.createElement('span');
        reviewText.classList.add('review-text');
        reviewText.innerText = review.content;
        
        // Create a container for the review buttons
        const reviewButtons = document.createElement('div');
        reviewButtons.classList.add('review-buttons');
        
        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteReview(review.id, reviewItem);
        
        // Create the Edit button
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = () => editReview(review.id, reviewText);
        
        
        // Append the Edit and Delete button
        reviewButtons.appendChild(editButton);
        reviewButtons.appendChild(deleteButton);
        
         // Append the review text and buttons
        reviewItem.appendChild(reviewText);
        reviewItem.appendChild(reviewButtons);
        reviewList.appendChild(reviewItem);
    });
}

/**
 * Submits the review.
 * 
 * @param {string} movieID - The ID of the movie.
 */
async function submitReview(movieID) {
    // Get the review input
    const reviewInput = document.getElementById('review-input');
    const content = reviewInput.value;
    
    // Check if content is empty
    if (!content) {
        alert('Review content cannot be empty');
        return;
    }
    
     // Send a POST request
    await fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieID, content })
    });
    
    // Clear the input and reload.
    reviewInput.value = '';
    loadReviews(movieID);
}

/**
 * Edits the review.
 * 
 * @param {string} reviewID - The ID of the review.
 * @param {HTMLElement} reviewText - The HTML element.
 */
async function editReview(reviewID, reviewText) {
    const newReview = prompt('Edit your review:', reviewText.innerText);
    if (newReview) {
        // Send a PUT request to the server
        await fetch(`/reviews/${reviewID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newReview })
        });
        // Update the review text
        reviewText.innerText = newReview;
    }
}

/**
 * Deletes the review.
 * 
 * @param {string} reviewID - The ID of the review.
 * @param {HTMLElement} reviewItem - The HTML element.
 */
async function deleteReview(reviewID, reviewItem) {
    // Send a DELETE request to the server.
    await fetch(`/reviews/${reviewID}`, {
        method: 'DELETE'
    });
     // Remove the review item
    reviewItem.remove();
}
