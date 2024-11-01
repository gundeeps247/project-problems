import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

function Profile() {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const getUserPosts = async () => {
      const postsQuery = query(collection(db, "posts"), where("author.id", "==", userId));
      const data = await getDocs(postsQuery);
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const getUserComments = async () => {
      const commentsQuery = query(collection(db, "comments"), where("author.id", "==", userId));
      const data = await getDocs(commentsQuery);
      setUserComments(data.docs.map((doc) => doc.data()));
    };

    getUserPosts();
    getUserComments();
  }, [userId]);

  return (
    <div className="profilePage">
      <h1>User Profile</h1>
      <h2>Posts by User</h2>
      {userPosts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.postText}</p>
        </div>
      ))}
      <h2>Comments by User</h2>
      {userComments.map((comment, index) => (
        <div key={index}>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;
