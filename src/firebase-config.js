import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZvUv12z10-p7a11zB2iJkC6oBJFwpkPw",
  authDomain: "project-problems.firebaseapp.com",
  projectId: "project-problems",
  storageBucket: "project-problems.firebasestorage.app",
  messagingSenderId: "257523410825",
  appId: "1:257523410825:web:0b331ec1d094fed0e1a358",
  measurementId: "G-EY9QPEMRJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
