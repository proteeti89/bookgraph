import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Save a book to the user's collection
export const saveBookForUser = async (userId, book) => {
  try {
    await addDoc(collection(db, "books"), {
      userId,
      ...book
    });
  } catch (error) {
    console.error("Error saving book:", error);
  }
};

// Fetch all books for a given user
export const getBooksForUser = async (userId) => {
  try {
    const q = query(collection(db, "books"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
