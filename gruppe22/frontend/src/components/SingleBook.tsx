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
    <div className="SingleBook">
      <img src={imageURL} width="200" height="240" />
      <p>
        <Link to={bookLink} className="LinkToBook">
          {book.title}
        </Link>
        <span>,&nbsp;</span>
        <Link to={"/AuthorPage"} className="LinkToAuthor">
          {book.author}
        </Link>
        <br />
        {book.description}
      </p>
    </div>
  );
}
