// Firebase configuration
// Using the real Firebase project credentials for Demargo ERMS
// This app will now use Firestore instead of localStorage mock mode.

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

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

// Initialize Firestore
export const db = getFirestore(app)
export const isFirebaseConfigured = true

export default app
