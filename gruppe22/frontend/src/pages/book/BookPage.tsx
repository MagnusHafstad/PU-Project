import { collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { Book } from "../../types";

export default function BookPage() {
  const { bookID } = useParams();
  const colRef = collection(db, "books");

  const [book, setBook] = React.useState<Book | undefined>();

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
  };

  async function fetchBook() {
    getDocs(colRef).then((snapshot) => {
      setBook(
        (currentBook = {
          id: { bookID },
          title: snapshot.docs.find((doc) => doc.id == bookID)?.get("title"),
          author: snapshot.docs.find((doc) => doc.id == bookID)?.get("author"),
          description: snapshot.docs.find((doc) => doc.id == bookID)?.get("description"),
          photo: snapshot.docs.find((doc) => doc.id == bookID)?.get("photo"),
        })
      );
    });
  }

  useEffect(() => {
    fetchBook();
  }, []);

  return <div>This is a book page for {book?.title}</div>;
}
