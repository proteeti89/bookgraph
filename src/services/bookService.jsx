export async function searchBooks(query) {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
    const data = await response.json();
  
    return data.docs.slice(0, 5).map((doc) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.join(", ") || "Unknown",
      themes: doc.subject?.slice(0, 5) || [],
      year: doc.first_publish_year,
      coverId: doc.cover_i,
    }));
  }
  
  export function getCoverUrl(coverId) {
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null;
  }

  export async function fetchCoverId(title) {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const data = await response.json();
  
    const book = data.docs?.[0];
    return book?.cover_i || null;
  }