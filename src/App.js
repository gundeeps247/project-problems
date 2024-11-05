import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PostDetail from "./components/PostDetail";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes and update state accordingly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        setCurrentUser(user);
      } else {
        setIsAuth(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
      setCurrentUser(null);
      window.location.pathname = "/login";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Router>
      <nav>
        <Link to="/"> Home </Link>
        {!isAuth ? (
          <Link to="/login"> Login </Link>
        ) : (
          <>
            <Link to="/createpost"> Create Post </Link>
            <button onClick={signUserOut}> Log Out</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/post/:postId" element={<PostDetail isAuth={isAuth} currentUser={currentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
