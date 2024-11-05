import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText, // Changed from 'description' to 'postText'
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
      timestamp: new Date(),
    });
    navigate("/");
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Tech Project Idea</h1>
        <div className="inputGp">
          <label>Title:</label>
          <input placeholder="Title..." onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="inputGp">
          <label>Description:</label>
          <textarea placeholder="Describe your project..." onChange={(e) => setPostText(e.target.value)} />
        </div>
        <button onClick={createPost}>Submit Idea</button>
      </div>
    </div>
  );
}

export default CreatePost;
