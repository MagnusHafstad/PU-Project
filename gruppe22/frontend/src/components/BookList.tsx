import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function BookList() {
  const colRef = collection(db, "books");

  const [books, setBooks] = React.useState<Book[] | undefined>();

  async function fetchBooks() {
    const temp_books: Book[] = [];
    const temp_book: Book = { title: "", author: "" };
    getDocs(colRef).then((snapshot) => {
      setBooks(
        snapshot.docs.map((doc) => {
          return {
            title: doc.get("title"),
            author: doc.get("author"),
          };
        })
      );
    });
    console.log(temp_books);
    setBooks(temp_books);
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div className="BookList">
        {books == undefined ? (
          <>
            <div>Laster ...</div>
          </>
        ) : (
          <>
            {books.map((book: Book) => {
              return <SingleBook b={book} />;
            })}
          </>
        )}
      </div>
    </>
  );
}