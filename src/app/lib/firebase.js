import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSOM7LeVg0PXPMyK20op_CHRzTEpOo6t0",
    authDomain: "first-project-67b63.firebaseapp.com",
    projectId: "first-project-67b63",
    storageBucket: "first-project-67b63.firebasestorage.app",
    messagingSenderId: "221149109541",
    appId: "1:221149109541:web:2ede958e1e92e24cd40ecc",
    measurementId: "G-V9QJML93HW"
};

// प्रोजेक्ट को इनिशियलाइज़ करना
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };