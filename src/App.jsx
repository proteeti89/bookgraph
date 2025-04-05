import React, { useState, useEffect } from "react";
import BookGraph from "./components/BookGraph";
import { initialBooks } from "./data/initialBooks";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import { fetchCoverId } from "./services/bookService";

export default function App() {
  const [books, setBooks] = useState(initialBooks);

  // Fetch missing covers when app loads
  useEffect(() => {
    async function enrichCovers() {
      const updatedBooks = await Promise.all(
        books.map(async (book) => {
          if (!book.coverId) {
            const coverId = await fetchCoverId(book.title);
            return { ...book, coverId };
          }
          return book;
        })
      );
      setBooks(updatedBooks);
    }

    enrichCovers();
  }, []);

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 The Reading Web: Visualize Your Reading Universe</h1>
      <BookForm onAddBook={handleAddBook} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <div className="mt-10">
        <BookGraph books={books} />
      </div>
    </div>
  );
}

