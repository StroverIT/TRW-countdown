import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error("Missing Firebase environment variables:", missingVars);
  console.error("Please create a .env file with the following variables:");
  missingVars.forEach((varName) => {
    console.error(`${varName}=your_value_here`);
  });
  throw new Error(
    `Firebase configuration is incomplete. Missing: ${missingVars.join(
      ", "
    )}. Please create a .env file with all required Firebase credentials.`
  );
}

// Validate that all config values are actually set (not undefined)
const configEntries = Object.entries(firebaseConfig);
const invalidEntries = configEntries.filter(([_, value]) => !value);

if (invalidEntries.length > 0) {
  const invalidKeys = invalidEntries.map(([key]) => key);
  console.error("Firebase configuration has undefined values:", invalidKeys);
  throw new Error(
    `Firebase configuration error. The following values are undefined: ${invalidKeys.join(
      ", "
    )}. Please check your .env file.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
enableNetwork(db).catch((err) => {
  console.error("Failed to enable Firestore offline persistence:", err);
});

export default app;
