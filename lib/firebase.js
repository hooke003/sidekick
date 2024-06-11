// Import Firebase dependencies
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB8i_D0yk8_PgSv2TnMOQbX44RZqTI5xbw",
  authDomain: "sidekick-d969c.firebaseapp.com",
  projectId: "sidekick-d969c",
  storageBucket: "sidekick-d969c.appspot.com",
  messagingSenderId: "215375613952",
  appId: "1:215375613952:web:0edb628a95ad56588608e5"
};

// Initialize Firebase if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export const createUser = async (email, password, username) => {
  try {
    // Create user with email and password (automatically signs in the user)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a document in Firestore
    const userDoc = {
      accountId: user.uid,
      email: user.email,
      username: username
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    return userDoc;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};