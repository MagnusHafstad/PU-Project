import { collection, getDocs, runTransaction, doc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { db } from "../../firebase-config";
import "./InsertBook.css";

export default function InsertBook() {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  function handleAddBook() {
    {
      /* Maybe ensure that user is in fact */
    }
    if (titleInputRef != null) {
      addBook();
    }
  }

  function addBook() {
    const bookRef = doc(db, "books/");

    return runTransaction(db, (transaction) => {
      return transaction.get(bookRef).then((res) => {
        if (!res.exists()) {
          throw "Document does not exist!";
        }

        // Setting if no photo is provided. Currently if photo is provided it is still not added to firebase
        if (photoInputRef == null) {
          transaction.update(bookRef, {
            auhtor: authorInputRef,
            description: descriptionInputRef,
            numUserRatings: 0,
          });
        } else {
          // Commit to Firestore
          transaction.update(bookRef, {
            auhtor: authorInputRef,
            description: descriptionInputRef,
            numUserRatings: 0,
            title: titleInputRef,
          });
        }
      });
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
