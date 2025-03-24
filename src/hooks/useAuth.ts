'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppStore } from '@/store';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { setUser: setStoreUser, logout: logoutStore } = useAppStore();

    useEffect(() => {
        // Check if auth is available (client-side only)
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                setUser(firebaseUser);
                setStoreUser({
                    isLoggedIn: true,
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || undefined,
                    email: firebaseUser.email || undefined,
                    image: firebaseUser.photoURL || undefined,
                });
            } else {
                setUser(null);
                logoutStore();
            }
            setLoading(false);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [setStoreUser, logoutStore]);

    return { user, loading };
}; 