import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";

export default function Favourites() {
  const { uid } = useParams();
  const [favBooks, setFavBooks] = React.useState<Book[] | undefined>();

  //   const [favourites, setFavourites] = React.useState<string[] | undefined>();
  const favourites: string[] = [];
  const bookRef = collection(db, "books");

  function getUserFavourites() {
    //gets regular user rating
    const favRef = collection(db, "users/" + uid + "/favourites");
    getDocs(favRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const bookId = doc.data().bookId;
        favourites?.push(bookId);
      });
    });
  }

  function getFavBooks() {
    favourites.map((fav) => {
      const bookRef = doc(db, "books", fav);
      const tempBooks: Book[] = [];
      getDoc(bookRef).then((doc) => {
        if (doc.exists()) {
          const bookData = doc.data();
          // Do something with the book data here
          console.log(bookData.title);
        } else {
          // Handle case where book doesn't exist
          console.log("Book not found!");
        }
      });
    });
  }

  useEffect(() => {
    getUserFavourites();
    getFavBooks();
  }, []);

  return <></>;
  //   function getUserFavourites() {
  //     //gets regular user rating
  //     const favRef = collection(db, "users/" + uid + "/favourites");
  //     getDocs(favRef).then((snapshot) => {
  //       snapshot.docs.map((doc) => {
  //         favourites?.push(doc.bookId);
  //       });
  //     });
}
