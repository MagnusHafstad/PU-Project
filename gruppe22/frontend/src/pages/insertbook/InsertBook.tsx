import React, { useEffect, useRef } from "react";
import "./InsertBook.css";

export default function InsertBook() {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  function handleAddBook() {
    console.log("Gaming Console");
  }

  return (
    <form>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required ref={titleInputRef} />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input id="author" name="author" type="text" required ref={authorInputRef} />
      </div>
      <div>
        <label htmlFor="photo">Photo</label>
        <input id="photo" name="filename" type="file" accept="image/png, image/gif, image/jpeg" ref={photoInputRef} />
      </div>
      {/* Might require newline */}
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required ref={descriptionInputRef} />
      </div>
      <button type="submit">Insert</button>
    </form>
  );
}
