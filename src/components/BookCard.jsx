import React from "react";
import { getCoverUrl } from "../services/bookService";

export default function BookCard({ book }) {
  if (!book) return null;

  const { title = "Untitled", author = "Unknown", themes = [], coverId = null } = book;
  const cover = getCoverUrl(coverId);

  return (
    <div className="border rounded shadow p-2 bg-white">
      {cover && (
        <img
          src={cover}
          alt={`${title} cover`}
          className="mb-2 w-full h-48 object-cover rounded"
        />
      )}
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-gray-700">by {author}</p>
      {themes.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">Themes: {themes.join(", ")}</p>
      )}
    </div>
  );
}
