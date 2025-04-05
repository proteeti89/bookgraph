import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4AzsIIQugNJtJxcUiehZzWU3_6NlEPWI",
  authDomain: "bookgraph-bbf54.firebaseapp.com",
  projectId: "bookgraph-bbf54",
  storageBucket: "bookgraph-bbf54.appspot.com",
  messagingSenderId: "428743721304",
  appId: "bookgraph-bbf54",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
