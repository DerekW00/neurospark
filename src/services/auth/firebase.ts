import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Register a new user with email and password
export const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user profile with the name
        await updateProfile(user, { displayName: name });

        // Store additional user data in Firestore
        await createUserProfile(user, { name });

        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in user:', error);
        throw error;
    }
};

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore, if not create a profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            await createUserProfile(user);
        }

        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

// Sign out
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Reset password
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

// Create a user profile in Firestore
const createUserProfile = async (user: User, additionalData: any = {}) => {
    try {
        const userRef = doc(db, 'users', user.uid);

        // Get data from the user's auth profile
        const { displayName, email, photoURL } = user;

        // Create the user document in Firestore
        await setDoc(userRef, {
            displayName: displayName || additionalData.name || '',
            email,
            photoURL: photoURL || '',
            createdAt: serverTimestamp(),
            ...additionalData
        });

        return userRef;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}; 