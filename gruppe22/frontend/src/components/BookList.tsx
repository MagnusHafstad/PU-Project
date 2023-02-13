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
    const temp_book: Book = { title: "", author: "", description: "" };
    getDocs(colRef).then((snapshot) => {
      setBooks(
        snapshot.docs.map((doc) => {
          return {
            title: doc.get("title"),
            author: doc.get("author"),
            description: doc.get("description"),
          };
        })
      );
    });
    console.log(temp_books);
    // setBooks(temp_books); fungerer fortsatt uten denne linjen
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
              //have to change the key property to something more unique then title, but didnt figure out how to fetch the id yet
              return <SingleBook key={book.title} book={book} />;
            })}
          </>
        )}
      </div>
    </>
  );
}
