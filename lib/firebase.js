// Import Firebase dependencies
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB8i_D0yk8_PgSv2TnMOQbX44RZqTI5xbw",
  authDomain: "sidekick-d969c.firebaseapp.com",
  projectId: "sidekick-d969c",
  storageBucket: "sidekick-d969c.appspot.com",
  messagingSenderId: "215375613952",
  appId: "1:215375613952:web:0edb628a95ad56588608e5",
};

// Initialize Firebase if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Function to generate avatar URL using DiceBear Avatars
const getAvatarUrl = (username) => {
  const firstLetter = username.charAt(0).toUpperCase();
  const avatarUrl = `https://avatars.dicebear.com/api/initials/${firstLetter}.svg`;
  return avatarUrl;
};

export const createUser = async (email, password, username) => {
  try {
    // Create user with email and password (automatically signs in the user)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Generate avatar URL with the first letter of the username
    const avatarUrl = getAvatarUrl(username);

    // Create a document in Firestore
    const userDoc = {
      accountId: user.uid,
      email: user.email,
      username: username,
      avatar: avatarUrl, // Use the generated avatar URL
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    return userDoc;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; // Re-throw the original error for better context
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user found.");

    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) throw new Error("User document not found.");

    return userDocSnap.data();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export { auth }; // Ensure auth is exported