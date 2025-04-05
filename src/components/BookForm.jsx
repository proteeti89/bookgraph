import React, { useState } from "react";
import { searchBooks } from "../services/bookService";

export default function BookForm({ onAddBook }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [manual, setManual] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    const books = await searchBooks(query);
    setResults(books);
  };

  const handleSelect = (book) => {
    onAddBook(book);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={() => setManual(!manual)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          {manual ? "Cancel Manual" : "Add Manually"}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="border p-2 rounded">
          {results.map(book => (
            <li
              key={book.id}
              onClick={() => handleSelect(book)}
              className="cursor-pointer hover:bg-green-100 p-1"
            >
              <strong>{book.title}</strong> by {book.author}
            </li>
          ))}
        </ul>
      )}

      {manual && (
        <ManualForm onAddBook={onAddBook} />
      )}
    </div>
  );
}

function ManualForm({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [themes, setThemes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      themes: themes.split(",").map(t => t.trim()),
    };
    onAddBook(newBook);
    setTitle("");
    setAuthor("");
    setThemes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Themes (comma separated)"
        value={themes}
        onChange={e => setThemes(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Book
      </button>
    </form>
  );
}

