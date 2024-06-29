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
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  getDoc,
  limit,
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

// Helper function to fetch creator data
const fetchCreatorData = async (postData) => {
  const userRef = postData.creator;
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    postData.creator = { id: userDoc.id, ...userDoc.data() };
  } else {
    postData.creator = null;  // Or handle this case differently
  }
  return postData;
};

// Function to get all video posts from Firestore
export const getAllPosts = async () => {
  try {
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const postData = { id: doc.id, ...doc.data() };
      return await fetchCreatorData(postData);
    }));
    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw new Error(error.message);
  }
};

// Function to get the latest 7 video posts from Firestore
export const getLatestPosts = async () => {
  try {
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc"),
      limit(7)
    );
    const querySnapshot = await getDocs(q);
    const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const postData = { id: doc.id, ...doc.data() };
      return await fetchCreatorData(postData);
    }));
    return posts;
  } catch (error) {
    console.error("Error getting latest posts:", error);
    throw new Error(error.message);
  }
};

// Function to get video posts that match the search query
export const searchPosts = async (searchQuery) => {
  try {
    console.log("Search query:", searchQuery);

    // Execute the query to get all documents from the videos collection
    const querySnapshot = await getDocs(collection(db, "videos"));
    console.log("Total posts fetched:", querySnapshot.size);

    // Convert the search query to lower case for case-insensitive search
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter the documents based on the search query
    const posts = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(post => post.title && post.title.toLowerCase().includes(lowerCaseQuery));

    console.log("Filtered posts count:", posts.length);

    // Return posts, even if empty
    return posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    // Re-throw the error to ensure it's caught by the caller
    throw new Error(error.message);
  }
};

// Function to get video posts created by a specific user from Firestore
export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, "videos"),
      where("creator", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw new Error(error.message);
  }
};

export { auth }; // Ensure auth is exported
