import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BookForm({ onAddBook }) {
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
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <Input placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <Input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
      <Input placeholder="Themes (comma separated)" value={themes} onChange={e => setThemes(e.target.value)} required />
      <Button type="submit">Add Book</Button>
    </form>
  );
}
