import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable } from "firebase/storage";
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
    const newPhoto = photoInputRef.current?.value;
    // splits up the filepath and pop retuns only the last segment. Which is the filename
    const photoName = photoInputRef.current?.value.split(/(\\|\/)/g).pop() || "";
    if (newTitle != null && newAuthor != null && newDescription != null) {
      // Exclamation marks means that ts trust that the const are not null
      addBook(newTitle!, newAuthor!, newPhoto, photoName, newDescription!);
    }
  };

  function addBook(newTitle: string, newAuthor: string, newPhoto: any, photoName: string, newDescription: string) {
    console.log(newDescription);
    console.log(newPhoto);
    console.log(photoName);

    if (photoInputRef == null) {
      const newBookRef = addDoc(collection(db, "books"), {
        author: newAuthor,
        description: newDescription,
        numUserRatings: 0,
        title: newTitle,
      });
    } else {
      const newBookRef = addDoc(collection(db, "books"), {
        author: newAuthor,
        description: newDescription,
        numUserRatings: 0,
        photo: photoName,
        title: newTitle,
      });
      // creates the filepath for the image
      const storageRefImages = ref(storage, "images/" + photoName);
      // uploads the image into firebase.
      // the method being resumable allows the upload to be paused, which is more complicated than needed. However it is not detrimental to use.
      uploadBytesResumable(storageRefImages, newPhoto).then((snapshot) => {
        console.log("Uploaded a file!");
      });
    }
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
