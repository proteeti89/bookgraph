import React, { useEffect, useState } from "react";
import BookGraph from "./components/BookGraph";
import BookForm from "./components/BookForm";
import { auth } from "./firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "./firebase"; // your Firebase setup
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getBooksForUser, saveBookForUser } from "./services/dbService";

const App = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userBooks = await getBooksForUser(currentUser.uid);
        setBooks(userBooks);
      } else {
        setBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add a new book to state + Firebase
  const handleAddBook = async (book) => {
    if (!user) return;
    await saveBookForUser(user.uid, book);
    setBooks((prev) => [...prev, book]);
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h1>📚 The Reading Web</h1>
        {user ? (
          <>
            <p>Welcome, {user.displayName}</p>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <button onClick={handleLogin}>Sign In with Google</button>
        )}
      </header>

      {user && (
        <>
          <BookForm onAddBook={handleAddBook} />
          <BookGraph books={books} />
        </>
      )}

      {!user && <p>Please sign in to view and save your reading graph.</p>}
    </div>
  );
};

export default App;
