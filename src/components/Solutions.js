import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Solutions({ postId }) {
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewSolution] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate();

  const loadSolutions = useCallback(async () => {
    try {
      const solutionsRef = collection(db, "posts", postId, "solutions");
      const solutionDocs = await getDocs(solutionsRef);
      const solutionsData = solutionDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSolutions(solutionsData);
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error loading solutions: ", error);
      setErrorMessage("Failed to load solutions. Please try again later.");
    }
  }, [postId]);

  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  const addSolution = async () => {
    if (!auth.currentUser || newSolution.trim() === "") {
      setErrorMessage("You must be logged in and provide a solution.");
      return;
    }

    try {
      const solutionsRef = collection(db, "posts", postId, "solutions");
      await addDoc(solutionsRef, {
        text: newSolution,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
        timestamp: new Date(),
      });
      setNewSolution(""); // Clear input after adding
      loadSolutions(); // Refresh solutions after adding a new one
      setErrorMessage(""); // Clear error message upon successful addition
    } catch (error) {
      console.error("Error adding solution: ", error);
      setErrorMessage("Failed to add solution. Please try again.");
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="solutionsSection">
      <h4>Solutions:</h4>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error message if exists */}
      <div>
        {solutions.length > 0 ? (
          solutions.map((solution) => (
            <p
              key={solution.id}
              onClick={() => handleProfileClick(solution.author.id)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              <strong>{solution.author.name}:</strong> {solution.text}
            </p>
          ))
        ) : (
          <p>No solutions yet. Be the first to solve this project!</p>
        )}
      </div>
      <input
        type="text"
        placeholder="Propose a solution..."
        value={newSolution}
        onChange={(e) => setNewSolution(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addSolution();
        }}
      />
      <button onClick={addSolution}>Submit Solution</button>
    </div>
  );
}

export default Solutions;
