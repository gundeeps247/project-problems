import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import Comments from "../components/Comments";
import Solutions from "../components/Solutions";
import { useNavigate } from "react-router-dom";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navigate to the post detail page
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="homePage">
      {postLists.map((post) => (
        <div className="post" key={post.id}>
          <h1 style={{ cursor: "pointer", color: "blue" }} onClick={() => handlePostClick(post.id)}>
            {post.title}
          </h1>
          <p>{post.description}</p>
          <h3 onClick={() => handleProfileClick(post.author.id)} style={{ cursor: "pointer", color: "blue" }}>
            Created by {post.author.name}
          </h3>
          <Comments postId={post.id} isAuth={isAuth} />
          <Solutions postId={post.id} isAuth={isAuth} />
        </div>
      ))}
    </div>
  );
}

export default Home;
