
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined = undefined;
let db: Firestore | undefined = undefined;

// For debugging: Log if projectId is missing
if (!firebaseConfig.projectId) {
  console.error(
    "Firebase projectId is missing from environment variables. " +
    "Please ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set correctly in your .env.local file " +
    "and that your Next.js environment is configured to load it."
  );
}

try {
  if (firebaseConfig.projectId) { // Only attempt to initialize if projectId is present
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } else {
    console.error("Firebase initialization skipped due to missing projectId.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase or Firestore:", error);
  // Depending on your app's needs, you might want to handle this more gracefully
  // or prevent the app from attempting to use `db` if it's undefined.
}

export { app, db };
