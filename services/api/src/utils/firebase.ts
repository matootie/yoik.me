/**
 * Firebase Admin SDK initialization.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS or default credentials).
if (getApps().length === 0) {
  initializeApp({
    projectId: "yoikme",
  })
}

export const db = getFirestore()
export const auth = getAuth()
