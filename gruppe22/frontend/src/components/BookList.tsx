import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function BookList() {
  const colRef = collection(db, "books");

  const [books, setBooks] = React.useState<Book[] | undefined>();

  async function fetchBooks() {
    // const temp_books: Book[] = [];
    getDocs(colRef).then((snapshot) => {
      setBooks(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.get("title"),
            author: doc.get("author"),
            description: doc.get("description"),
            photo: doc.get("photo"),
            avgUserRating: doc.get("avgUserRating"),
            numUserRatings: doc.get("numUserRatings"),
            avgProfRating: doc.get("avgProfRating"),
            numProfRatings: doc.get("numProfRatings"),
          };
        })
      );
    });
    // setBooks(temp_books);
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div className="BookList">
        <h1 className="ListTitle">Weekly news</h1>
        {books == undefined ? (
          <>
            <div>Laster ...</div>
          </>
        ) : (
          <>
            {books.map((book: Book, i) => {
              if (i < 4) {
                return <SingleBook book={book} />;
              } else {
                return;
              }
            })}
          </>
        )}
      </div>
    </>
  );
}
