// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsXcKRkIJJVZD5AUBDkmbf165Qrt_brGU",
  authDomain: "carelec-3c305.firebaseapp.com",
  projectId: "carelec-3c305",
  storageBucket: "carelec-3c305.appspot.com",
  messagingSenderId: "588882631000",
  appId: "1:588882631000:web:73c4299f249f86dad3ad2d"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider
provider.setCustomParameters({
  prompt: "select_account",
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();
export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, 'user', userAuth.uid);

  console.log(userDocRef);

  const userSnapShot = await getDoc(userDocRef);
  console.log(userSnapShot);
  console.log(userSnapShot.exists());

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        createAt,
        displayName,
        email,
      })
    } catch (error) {
      console.log("erreur pendant la création " + error.message)
    }
  }

  return userDocRef;
}