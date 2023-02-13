import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import "./Styles.css";
import "../miniLau.png";

export default function BookDetails() {
  const [book, setBook] = React.useState<Book | undefined>();
  //have to change bookId to be fetched from URL, when it is set up. Maybe something like this.props.match.params.id elns
  const bookId: string | undefined = "P08AgGRaGeTuPwZpVimW";
  //"books" in the line below refers to the table in the database/document in firestore and bookId gives the id of a specific book
  const booksRef = doc(db, "books", bookId);

  async function fetchBook() {
    const tempBook: Book = { title: "", author: "", description: "" };

    getDoc(booksRef).then((snapshot) => {
      tempBook.title = snapshot.get("title");
      tempBook.author = snapshot.get("author");
      tempBook.description = snapshot.get("description");

      setBook(tempBook);
    });
  }

  useEffect(() => {
    fetchBook();
  }, []);

  return (
    <>
      <div className="BookDetParent">
        <img className="BookDet" src="https://www.w3schools.com/css/img_lights.jpg" alt="Mountain"></img>
        {book == undefined ? (
          <div>Laster ...</div>
        ) : (
          <div className="BookDetChild">
            <h1 className="BookDetHeader">
              Title: <span className="BookInfo">{book.title}</span>
            </h1>
            <h1 className="BookDetHeader">
              Author: <span className="BookInfo">{book.author}</span>
            </h1>
            <h3 className="BookDetHeader">
              Description: <span className="BookInfo">{book.description}</span>
            </h3>
          </div>
        )}
      </div>
    </>
  );
}
