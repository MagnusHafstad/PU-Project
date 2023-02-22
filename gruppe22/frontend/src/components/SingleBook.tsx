import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "../types";
import { ref, getDownloadURL } from "firebase/storage";
import "./Styles.css";
import { storage } from "../firebase-config";

interface Props {
  book: Book;
}

export default function SingleBook({ book }: Props) {
  const [imageURL, setImageURL] = useState("");
  async function fetchImage() {
    let photoName: string = book.photo;
    if (book.photo == null) {
      photoName = "no_image.jpg";
    }
    const reference = ref(storage, "images/" + photoName);
    getDownloadURL(reference).then((url) => {
      setImageURL(url);
    });
    return;
  }
  fetchImage();
  const bookLink: string = "/BookPage/" + book.id;
  return (
    <html>
      <body>
        <div className="SingleBook">
          <div className="SingleBookPhoto">
            <Link to={bookLink} className="PhotoLink">
              <img src={imageURL} className="BookListPhoto" />
            </Link>
          </div>
          <div className="SingleBookInfo">
            <Link to={bookLink} className="LinkToBook">
              <h2>{book.title}</h2>
              <h3>by {book.author}</h3>
              <p className="Description">{book.description}</p>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
