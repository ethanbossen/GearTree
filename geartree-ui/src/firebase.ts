
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvYfjz626kwvqw6MmI-O4UBi68tTce-nE",
  authDomain: "geartree-aeab7.firebaseapp.com",
  projectId: "geartree-aeab7",
  storageBucket: "geartree-aeab7.firebasestorage.app",
  messagingSenderId: "722974759577",
  appId: "1:722974759577:web:85cadd55437ca6e9dfb608",
  measurementId: "G-HJFW6WQ5RN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();