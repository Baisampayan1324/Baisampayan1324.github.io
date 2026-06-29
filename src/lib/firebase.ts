import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

// Public Firebase web config (safe to expose — security is enforced by
// Realtime Database rules, not by hiding these). Set in .env.local:
//   NEXT_PUBLIC_FIREBASE_API_KEY=...
//   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://<project>-default-rtdb.firebaseio.com
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Only enable when the database URL + key are present, so the app runs fine
// without Firebase configured (the live counter just hides itself).
export const firebaseEnabled = Boolean(config.databaseURL && config.apiKey);

export function getDb(): Database | null {
  if (!firebaseEnabled) return null;
  const app = getApps().length ? getApp() : initializeApp(config);
  return getDatabase(app);
}
