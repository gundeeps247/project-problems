


import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Comments({ postId, isAuth }) {
  const [comments, setComments] = useState([]);

  // Memoize loadComments so it doesn't get recreated on each render
  const loadComments = useCallback(async () => {
    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentDocs = await getDocs(commentsRef);
      const commentsData = commentDocs.docs.map((doc) => doc.data());
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments: ", error);
    }
  }, [postId]); // Add postId as a dependency since it's used inside the function

  useEffect(() => {
    loadComments();
  }, [loadComments]); // Include loadComments in the dependency array

  const addComment = async (commentText) => {
    if (commentText.trim() === "") return;

    if (!auth.currentUser) {
      alert("You need to be logged in to add a comment.");
      return;
    }

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: commentText,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
        timestamp: new Date(),
      });
      loadComments(); // Refresh comments after adding
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="commentsSection">
      <h4>Comments:</h4>
      <div>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <p key={index}><strong>{comment.author.name}:</strong> {comment.text}</p>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
      <input
        type="text"
        placeholder="Add a comment..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addComment(e.target.value);
            e.target.value = ""; // Clear input after submitting
          }
        }}
      />
    </div>
  );
}

export default Comments;