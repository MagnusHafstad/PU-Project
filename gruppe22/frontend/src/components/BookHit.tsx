import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Hit } from "react-instantsearch-core";
import { db } from "../firebase-config";
import { Book } from "../types";
import SingleBook from "./SingleBook";

interface HitProps {
  hit: Hit<Book>;
}

const colRef = collection(db, "books");
const currentBook: Book = {
  id: "",
  title: "",
  author: "",
  description: "",
  photo: "",
  avgUserRating: 0,
};

async function fetchBook(bookID: string) {
  const snapshot = await getDocs(colRef);
  const fetchedBook = {
    id: bookID,
    title: snapshot.docs.find((doc) => doc.id === bookID)?.get("title"),
    author: snapshot.docs.find((doc) => doc.id === bookID)?.get("author"),
    description: snapshot.docs.find((doc) => doc.id === bookID)?.get("description"),
    photo: snapshot.docs.find((doc) => doc.id === bookID)?.get("photo"),
    avgUserRating: snapshot.docs.find((doc) => doc.id === bookID)?.get("avgUserRating"),
  };
  return fetchedBook;
}

const BookHit: React.FunctionComponent<HitProps> = ({ hit }) => {
  const [book, setBook] = useState<Book>(currentBook);

  useEffect(() => {
    fetchBook(hit.objectID).then((fetchedBook) => {
      setBook(fetchedBook);
    });
  }, [hit.objectID]);

  if (!book) {
    return null;
  }

  return <div>{<SingleBook book={book} />}</div>;
};

export default BookHit;
