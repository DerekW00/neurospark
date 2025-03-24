// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useState, useEffect } from "react";
import type { Analytics } from "firebase/analytics";
// Don't import getAnalytics at the top level, will be imported dynamically

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // Your web app's Firebase configuration
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined
};

// Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Don't initialize analytics here - we'll provide a hook for it

export { app, auth, db, storage };

// Hook for using analytics safely in components
export function useFirebaseAnalytics() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        const initAnalytics = async () => {
            try {
                const { getAnalytics } = await import('firebase/analytics');
                setAnalytics(getAnalytics(app));
            } catch (error) {
                console.error("Failed to initialize analytics:", error);
            }
        };

        initAnalytics();
    }, []);

    return analytics;
} 