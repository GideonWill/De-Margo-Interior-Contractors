// Firebase configuration
// Using the real Firebase project credentials for Demargo ERMS
// This app will now use Firestore instead of localStorage mock mode.

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC09_b_uWspKRQPEyuaPk5JZwwDTH68zpw",
    authDomain: "demargo-erms.firebaseapp.com",
    databaseURL: "https://demargo-erms-default-rtdb.firebaseio.com",
    projectId: "demargo-erms",
    storageBucket: "demargo-erms.firebasestorage.app",
    messagingSenderId: "132903868292",
    appId: "1:132903868292:web:480df39d05d885517cefd1",
    measurementId: "G-39Y9DSKP29"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const isFirebaseConfigured = true

let authInitialized = false
export const initFirebaseAuth = async () => {
    if (authInitialized) return auth.currentUser
    authInitialized = true

    if (auth.currentUser) {
        return auth.currentUser
    }

    try {
        await signInAnonymously(auth)
    } catch (error) {
        console.warn('Firebase anonymous auth failed:', error)
        // If anonymous auth is not allowed, we still allow the app to continue and let Firestore rules report the actual error.
    }

    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            resolve(user)
        }, (error) => {
            unsubscribe()
            reject(error)
        })
    })
}

export default app
