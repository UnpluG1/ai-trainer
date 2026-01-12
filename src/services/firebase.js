import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "ai-trainer-505cb.firebaseapp.com",
    projectId: "ai-trainer-505cb",
    storageBucket: "ai-trainer-505cb.firebasestorage.app",
    messagingSenderId: "252641026404",
    appId: "1:252641026404:web:8b1be7153ca252787b1a71"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = "ai-trainer-505cb";
