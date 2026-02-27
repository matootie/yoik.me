/**
 * Firebase utilities — auth only.
 * Firestore access is now handled by the API service.
 */

// External imports.
import { initializeApp } from "firebase/app"
import { getAuth as getFirebaseAuth, Auth } from "firebase/auth"

// Initialize the Firebase SDK.
const app = initializeApp({
  apiKey: "AIzaSyCPZpgvsErjawUxN_MRf5_oZhemV2sGjSs",
  authDomain: "yoikme.firebaseapp.com",
  projectId: "yoikme",
  storageBucket: "yoikme.appspot.com",
  messagingSenderId: "1036954538555",
  appId: "1:1036954538555:web:bebedadb6fafdfdc85421e",
})

/**
 * Get the Auth instance.
 */
export function getAuth(): Auth {
  return getFirebaseAuth(app)
}

/**
 * Re-exports from the Firebase SDK.
 */
export type { User as FirebaseUser } from "firebase/auth"
export {
  signInAnonymously,
  signOut,
  setPersistence,
  onAuthStateChanged,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"
