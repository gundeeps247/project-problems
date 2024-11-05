import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userSolutions, setUserSolutions] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("author.id", "==", userId));
      const postDocs = await getDocs(q);
      const postsData = postDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setUserPosts(postsData);

      // Fetch comments and solutions for each post authored by the user
      const commentsPromises = postsData.map(async (post) => {
        const commentDocs = await getDocs(collection(db, "posts", post.id, "comments"));
        const comments = commentDocs.docs.map(commentDoc => ({
          ...commentDoc.data(),
          postId: post.id,
          postTitle: post.title, // Add post title for reference
        }));
        return comments;
      });

      const solutionsPromises = postsData.map(async (post) => {
        const solutionDocs = await getDocs(collection(db, "posts", post.id, "solutions"));
        const solutions = solutionDocs.docs.map(solutionDoc => ({
          ...solutionDoc.data(),
          postId: post.id,
          postTitle: post.title, // Add post title for reference
        }));
        return solutions;
      });

      // Wait for all comments and solutions to be fetched
      const commentsResults = await Promise.all(commentsPromises);
      const solutionsResults = await Promise.all(solutionsPromises);

      // Flatten the arrays of comments and solutions
      setUserComments(commentsResults.flat());
      setUserSolutions(solutionsResults.flat());
    };

    fetchUserPosts();
  }, [userId]);

  // Function to navigate to the specific post
  const navigateToPost = (postId) => {
    navigate(`/post/${postId}`); // Navigate to post detail page
  };

  return (
    <div className="profilePage">
      <h1>User Profile</h1>

      <section>
        <h2>User's Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <div key={post.id} className="post">
              <h3 style={{ cursor: "pointer", color: "blue" }} onClick={() => navigateToPost(post.id)}>
                {post.title}
              </h3>
              <p>{post.postText}</p>
            </div>
          ))
        ) : (
          <p>No posts by this user.</p>
        )}
      </section>

      <section>
        <h2>User's Comments</h2>
        {userComments.length > 0 ? (
          userComments.map((comment, index) => (
            <div key={index}>
              <p>
                <strong>{comment.author.name}:</strong> {comment.text} 
                <br />
                <em>On post: <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigateToPost(comment.postId)}>{comment.postTitle}</span></em>
              </p>
            </div>
          ))
        ) : (
          <p>No comments by this user.</p>
        )}
      </section>

      <section>
        <h2>User's Solutions</h2>
        {userSolutions.length > 0 ? (
          userSolutions.map((solution, index) => (
            <div key={index}>
              <p>
                <strong>{solution.author.name}:</strong> {solution.text} 
                <br />
                <em>For post: <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigateToPost(solution.postId)}>{solution.postTitle}</span></em>
              </p>
            </div>
          ))
        ) : (
          <p>No solutions by this user.</p>
        )}
      </section>
    </div>
  );
}

export default Profile;
