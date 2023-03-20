import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { Book } from "../../types";
import "./EditPage.css";

interface Props {
  book: Book;
}

export default function EditPage() {
  const { bookID } = useParams();
  const colRef = collection(db, "books");

  const [book, setBook] = React.useState<Book | undefined>();

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
    avgUserRating: 0,
    numUserRatings: 0,
    avgProfRating: 0,
    numProfRatings: 0,
  };

  // fetches the book from the database
  async function fetchBook() {
    getDocs(colRef).then((snapshot) => {
      setBook(
        (currentBook = {
          id: { bookID },
          title: snapshot.docs.find((doc) => doc.id == bookID)?.get("title"),
          author: snapshot.docs.find((doc) => doc.id == bookID)?.get("author"),
          description: snapshot.docs.find((doc) => doc.id == bookID)?.get("description"),
          photo: snapshot.docs.find((doc) => doc.id == bookID)?.get("photo"),
          avgUserRating: snapshot.docs.find((doc) => doc.id == bookID)?.get("avgUserRating"),
          numUserRatings: snapshot.docs.find((doc) => doc.id == bookID)?.get("numUserRatings"),
          avgProfRating: snapshot.docs.find((doc) => doc.id == bookID)?.get("avgProfRating"),
          numProfRatings: snapshot.docs.find((doc) => doc.id == bookID)?.get("numProfRatings"),
        })
      );
    });
  }

  useEffect(() => {
    fetchBook();
    // fetchImage();
  }, []);

  return (
    <div className="EditPageMain">
      <h1>Edit Page for {book?.title}</h1>
    </div>
  );
}
