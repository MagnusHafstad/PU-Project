import { collection, addDoc, getDocs, runTransaction, doc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable } from "firebase/storage";
import { Admin } from "../../types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// a premade tag made for selecting mutiple elements that was made with typescript not javascript like Select from react-select.
// package retrieved from: https://www.npmjs.com/package/react-multi-select-component
import { MultiSelect } from "react-multi-select-component";
import "./InsertBook.css";

export default function InsertBook() {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const publicationYearInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  //the code below is for checking if user is admin or not
  const colAdm = collection(db, "admin");

  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
  // const [username, setUsername] = React.useState<string | null>();

  const genres = [
    { label: "Barnebok", value: "barnebok" },
    { label: "Sakprosa", value: "sakprosa" },
    { label: "Fantasy", value: "fantasy" },
  ];

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getUser();
    fetchAdmin();
    // fetchImage();
  }, []);

  //fetches admin uids from db
  async function fetchAdmin() {
    console.log(uid);
    getDocs(colAdm).then((snapshot) => {
      setAdmins(
        snapshot.docs.map((doc) => {
          return {
            uid: doc.get("uid"),
          };
        })
      );
    });
  }

  //checks if user is admin
  function checkAdmin() {
    if (admins?.find((a) => a.uid == uid)) {
      return true;
    } else {
      return false;
    }
  }

  //find user and setsd uid to user.uid
  function getUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        // setUsername(user.email);
        setUid(user.uid);
      }
    });
  }

  const handleAddBook = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    {
      /* Maybe ensure that user is in fact admin here? */
    }
    const newTitle = titleInputRef.current?.value.toString();
    const newAuthor = authorInputRef.current?.value.toString();
    // required should prevent a value that isn't a number from being entered
    const newPublicationYear = parseInt(publicationYearInputRef.current?.value || "0");
    const newDescription = descriptionInputRef.current?.value.toString();
    const files = photoInputRef.current?.files;
    if (newTitle != null && newAuthor != null && newDescription != null) {
      // files is a tricky const to check since there are three possible values it might have if no photo has been uploaded
      if (files == null || files == undefined || files[0] == null) {
        // Exclamation marks means that ts trust that the const are not null
        // "no_image.jpg" ensures that the default image is used
        addBook(newTitle!, newAuthor!, newPublicationYear, selected, null, "no_image.jpg", newDescription!);
      } else {
        const newPhoto = files[0];
        // Exclamation marks means that ts trust that the const are not null
        addBook(newTitle!, newAuthor!, newPublicationYear, selected, newPhoto, newPhoto.name, newDescription!);
      }
    }
  };

  async function addBook(
    newTitle: string,
    newAuthor: string,
    newPublicationYear: number,
    genres: any,
    newPhoto: any,
    photoName: string,
    newDescription: string
  ) {
    console.log(newDescription);
    console.log(newPhoto);
    console.log(photoName);

    const newBook = addDoc(collection(db, "books"), {
      author: newAuthor,
      description: newDescription,
      numUserRatings: 0,
      photo: photoName,
      title: newTitle,
      publicationYear: newPublicationYear,
    });

    const genreCollectionPath = (await newBook).id + "/genres";

    console.log(genreCollectionPath);

    const genresCollection = collection(collection(db, "books"), genreCollectionPath);

    if (newPhoto != null) {
      // creates the filepath for the image
      const storageRefImages = ref(storage, "images/" + photoName);
      // uploads the image into firebase.
      // the method being resumable allows the upload to be paused, which is more complicated than needed. However it is not detrimental to use.
      uploadBytesResumable(storageRefImages, newPhoto).then((snapshot) => {
        console.log("Uploaded a file!");
      });
    }

    // const genresRef = collection(newBookRef, "genres");

    // genres should perhaps be a separate thing on firebase like users, but for now this solution is sufficent
    let fieldName;
    genres.forEach(
      (element: any) => (fieldName = element.value.toString()),
      addDoc(genresCollection, {
        test: "!",
      })
    );
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
        <label htmlFor="author">Publication year</label>
        <input
          id="publicationYear"
          name="publicationYear"
          type="number"
          step="1"
          required
          ref={publicationYearInputRef}
        />
      </div>
      <div className="MultiSelect">
        <MultiSelect options={genres} value={selected} onChange={setSelected} labelledBy="Select" />
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
      {checkAdmin() ? <button type="submit">Insert</button> : <p>You have to be an admin to submit a newBook</p>}
    </form>
  );
}
