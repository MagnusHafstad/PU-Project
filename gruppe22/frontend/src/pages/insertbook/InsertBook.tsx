import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { db } from "../../firebase-config";
import "./InsertBook.css";

export default function InsertBook() {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const handleAddBook = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    {
      /* Maybe ensure that user is in fact admin here? */
    }
    const newTitle = titleInputRef.current?.value.toString();
    const newAuthor = authorInputRef.current?.value.toString();
    // Lacks photo do to unsure how to add photo
    const newDescription = descriptionInputRef.current?.value.toString();

    if (newTitle != null && newAuthor != null && newDescription != null) {
      // Exclamation marks means that ts trust that the const are not null
      addBook(newTitle!, newAuthor!, newDescription!);
    }
  };

  function addBook(newTitle: string, newAuthor: string, newDescription: string) {
    console.log(newDescription);

    const newBookRef = addDoc(collection(db, "books"), {
      author: newAuthor,
      description: newDescription,
      numUserRatings: 0,
      title: newTitle,
    });
  }

  return (
    <form onSubmit={handleAddBook}>
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
