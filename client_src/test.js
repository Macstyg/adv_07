(function(global){
  'use strict';
  const BASE_URL       = 'http://localhost:3000/json-server',
        POSTS_URL      = `${BASE_URL}/posts`,
        USERS_URL      = `${BASE_URL}/users`,
        totalContainer = document.getElementById('totalLikes'),
        commentsContainer = document.getElementById('comments');


  let getPostsPromise = fetch(POSTS_URL)
    .then( (res) =>{
      return res.json()
    });

// Update likes in 466 post

  let updatePostLikes = getPostsPromise
    .then( (posts) => {
      var our_post = {};
      posts.forEach( (post) => {
        if (post.id === 466) our_post = post;
      });
      return our_post;
    })
    .then( (our_post) => {
      our_post.likeCount++;
      return fetch(POSTS_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(our_post)
      });
    });

// count likes in all posts
var user_comment = [];
      var user_id = [];
      var user_name = [];
      var result = [];

  let countLikes = getPostsPromise
    .then((posts) => {
      var totalLikes = 0;
      posts.forEach( (post) => {
        totalLikes += post.likeCount;
      });
      return totalContainer.innerHTML = totalLikes;
    });

  let get466Post = fetch(`${POSTS_URL}/466`)
    .then( (res) => {
      return res.json();
    });

  let get466PostComments = get466Post
    .then( (post) => {
      return post.comments;
    })
    .then( (comments) => {
      comments.forEach( (comment) => {
        user_id.push(comment.user);
        user_comment.push(comment.text);
      })
      return user_id;
    })

  Promise.all([get466PostComments])
    .then( (res) => {
      res[0].forEach( (userId) => {
        return fetch(`${USERS_URL}/${res[0][userId]}`)
          .then((res) => {
            return res.json();
          })
          .then( (user) => {
           result.push(`${user.name}:${user_comment[userId]}`);
            commentsContainer.innerHTML = result.join('; ');
          });
      })
    })

}(window));
