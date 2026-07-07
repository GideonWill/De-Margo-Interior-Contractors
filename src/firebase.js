// Firebase configuration
// Using the real Firebase project credentials for Demargo ERMS
// This app will now use Firestore instead of localStorage mock mode.

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demargo-erms.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demargo-erms-default-rtdb.firebaseio.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demargo-erms",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demargo-erms.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "132903868292",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:132903868292:web:480df39d05d885517cefd1",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-39Y9DSKP29"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
storage.maxUploadRetryTime = 6000 // 6 seconds
storage.maxOperationRetryTime = 6000 // 6 seconds
export const isFirebaseConfigured = true

export const initFirebaseAuth = async () => {
    // If already signed in, return immediately
    if (auth.currentUser) {
        return auth.currentUser
    }

    try {
        const userCredential = await signInAnonymously(auth)
        console.log('Anonymous auth successful, uid:', userCredential.user.uid)
        return userCredential.user
    } catch (error) {
        console.warn('Firebase anonymous auth failed:', error.code, error.message)
        // Return null but don't cache the failure — allow retry on next call
        return null
    }
}

export default app
