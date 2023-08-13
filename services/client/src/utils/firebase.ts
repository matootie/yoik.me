/**
 * Firebase utilities.
 */

// External imports.
import { initializeApp } from "firebase/app"
import { getAuth as getFirebaseAuth, Auth } from "firebase/auth"
import {
  getFirestore as getFirebaseFirestore,
  Firestore,
} from "firebase/firestore"

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
 * Get the Firestore instance.
 */
export function getFirestore(): Firestore {
  return getFirebaseFirestore(app)
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
} from "firebase/auth"
export {
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  doc,
  collection,
  orderBy,
  limit,
  where,
  startAfter,
  startAt,
  serverTimestamp,
} from "firebase/firestore"
