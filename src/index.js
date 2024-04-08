document.addEventListener('DOMContentLoaded', function() {
  fetchData();

  // Event listener for form submission
  document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const commentInput = document.getElementById('comment');
    const commentContent = commentInput.value;
    addNewComment(commentContent);
    commentInput.value = ''; // Clear input field after adding comment
  });

  // Event listener for like button click
  document.getElementById('like-button').addEventListener('click', incrementLikes);
});

function fetchData() {
  fetch('http://localhost:3000/images/1')
   .then(response => response.json())
   .then(data => {
      const title = document.getElementById('card-title');
      const image = document.getElementById('card-image');
      const likes = document.getElementById('like-count');
      const commentsList = document.getElementById('comments-list');

      title.textContent = data.title;
      image.src = data.image;
      likes.textContent = 'Likes: ' + data.likes; // Update the likes count on the page
      commentsList.innerHTML = "";

      data.comments.forEach(comment => {
        let commentElement = document.createElement('li');
        commentElement.textContent = comment.content;
        commentsList.appendChild(commentElement);
      });
    })
  
}

// Function to increment likes on like button click
function incrementLikes() {
  // Fetch the current number of likes from the server
  fetch('http://localhost:3000/images/1')
   .then(response => response.json())
   .then(data => {
      const currentLikes = data.likes;
      const newLikes = currentLikes + 1; // Increment the likes by one

      // Update the server with the new number of likes
      fetch('http://localhost:3000/images/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ likes: newLikes })
      })
     .then(response => response.json())
     .then(updatedData => {
        const likes = document.getElementById('like-count');
        likes.textContent = updatedData.likes + ' likes'; // Update the likes count on the page
      });
    })
  
}

// Function to add a new comment
function addNewComment(commentContent) {
  const commentsList = document.getElementById('comments-list');
  const commentElement = document.createElement('li');
  commentElement.textContent = commentContent;
  commentsList.appendChild(commentElement);

  // Prepare the new comment object for POST request
  const newComment = {
    imageId: 1,
    content: commentContent
  };

  // Make a POST request to add the new comment
  fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  })
 .then(response => response.json())
 .then(updatedComment => {
    // Optionally, handle the response if needed
    console.log('New comment added:', updatedComment);
  })
}
