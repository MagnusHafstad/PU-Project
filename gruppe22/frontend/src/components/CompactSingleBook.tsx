import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "../types";
import { ref, getDownloadURL } from "firebase/storage";
import "./Styles.css";
import { collection, getDocs } from "firebase/firestore";
import { storage, db } from "../firebase-config";

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

  async function getAvgRating() {
    const colRef = collection(db, "books/" + book.id + "/userRatings");
    const [ratings, setRatings] = React.useState<number[]>();
    const temp_ratings: number[] = [];
    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const rating = doc.get("Rating");
        temp_ratings.push(rating);
      });
    });
    setRatings(temp_ratings);
    return;
  }

  const bookLink: string = "/BookPage/" + book.id;
  return (
    <body>
      <div className="CompactSingleBook">
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
        <div className="Ratings">
          <h3> {book.avgUserRating?.toFixed(1) || "no ratings"}</h3>
        </div>
      </div>
    </body>
  );
}
