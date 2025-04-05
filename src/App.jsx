import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

import React, { useState } from "react";
import BookGraph from "./components/BookGraph";
import { initialBooks } from "./data/initialBooks";
import BookForm from "./components/BookForm";

export default function App() {
  const [books, setBooks] = useState(initialBooks);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 BookGraph: Visualize Your Reading Universe</h1>
      <BookForm onAddBook={book => setBooks([...books, book])} />
      <BookGraph books={books} />
    </div>
  );
}

