// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // Your web app's Firebase configuration

    apiKey: "AIzaSyBkNCO_7wEIu9m4rndL2IyynDMPzUdHzKI",
    authDomain: "sample-firebase-ai-app-d3cf6.firebaseapp.com",
    projectId: "sample-firebase-ai-app-d3cf6",
    storageBucket: "sample-firebase-ai-app-d3cf6.firebasestorage.app",
    messagingSenderId: "390561985174",
    appId: "1:390561985174:web:53bbb6ca59b5b0531ec8b7"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 