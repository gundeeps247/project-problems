import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import Comments from "./Comments";
import Solutions from "./Solutions";
import { useParams } from "react-router-dom";

function PostDetail() {
  const { postId } = useParams(); // Get post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setPost({ ...postDoc.data(), id: postDoc.id });
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="postDetail">
      <h1>{post.title}</h1>
      <p>{post.postText}</p>
      <h3>Comments:</h3>
      <Comments postId={post.id} />
      <h3>Solutions:</h3>
      <Solutions postId={post.id} />
    </div>
  );
}

export default PostDetail;
