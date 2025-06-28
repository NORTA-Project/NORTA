import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_APP_ID || "demo-app-id",
};

// Firebase設定が正しくない場合のエラーハンドリング
let app: FirebaseApp | null;
let db: Firestore | null;
let auth: Auth | null;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    console.warn("Running in demo mode. Please configure Firebase environment variables.");
    
    // デモモード用のダミー設定
    app = null;
    db = null;
    auth = null;
}

export { db, auth };
