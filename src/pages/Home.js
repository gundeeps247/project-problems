import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import Comments from "../components/Comments";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  return (
    <div className="homePage">
      {postLists.map((post) => (
        <div className="post" key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.postText}</p>
          <h3>@{post.author.name}</h3>
          <Comments postId={post.id} isAuth={isAuth} />
        </div>
      ))}
    </div>
  );
}

export default Home;