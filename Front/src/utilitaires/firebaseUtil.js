import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDsXcKRkIJJVZD5AUBDkmbf165Qrt_brGU",
  authDomain: "carelec-3c305.firebaseapp.com",
  projectId: "carelec-3c305",
  storageBucket: "carelec-3c305.appspot.com",
  messagingSenderId: "588882631000",
  appId: "1:588882631000:web:73c4299f249f86dad3ad2d"
};

// permet de se connecter à mon applicaiton firebase (cf - firebaseConfig)
const app = initializeApp(firebaseConfig);


// Création, Ajout, Connexion depuis l'API Auth de Firebase
// --------------------------------------------------------------------------------------
// https://firebase.google.com/docs/reference/js/auth.md#getauth
// permet d'avoir une instance de Auth de mon application firebase
const auth = getAuth();

//https://firebase.google.com/docs/reference/js/auth.md#createuserwithemailandpassword
// wraper afin de créer un utilisateur dans Auth (Promise !)
const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}
// wraper afin de connecter un utilisatuer depuis Auth (Promise !)
const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

//https://firebase.google.com/docs/reference/js/auth.md#signout
const signOut = () => {
  signOut(auth);
}


// Gestion de la bdd depuis Firebase firestore
// --------------------------------------------------------------------------------------
const db = getFirestore();

// créer un user dans firestore
const createUser = (userAuth, infosUser) => {
  if (!userAuth)
    return

  const refDoc = doc(db, "users", userAuth.uid);

  getDoc(refDoc)
    .then(userSnapShot => {
      if (!userSnapShot.exists()) {
        setDoc(refDoc, {
          ...infosUser,
        })
      }
    }).catch(err => console.log(err.code));
}

const addRdvUser = (userUid, infosVehicule) => {
  const refDoc = doc(db, "rdv", userUid);
  return getDoc(refDoc)
    .then(doc => {
      setDoc(refDoc, {
        ...infosVehicule,
      }, { merge: false })
    })
}

export { signUp, signIn, createUser, auth, addRdvUser }