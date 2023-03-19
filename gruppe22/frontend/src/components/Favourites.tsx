import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, doc, DocumentData, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";

export default function Favourites(props: { uid: string }) {
  const [favBooks, setFavBooks] = React.useState<Book[] | undefined>();

  const [favourites, setFavourites] = React.useState<string[] | undefined>();
  // const bookRef = collection(db, "books");

  async function getUserFavourites() {
    const favRef = collection(db, "users/" + props.uid.toString() + "/favourites");
    const tempFavourites: string[] = [];
    const snapshot = await getDocs(favRef);
    snapshot.docs.map((doc) => {
      tempFavourites.push(doc.get("bookId"));
    });
    setFavourites(tempFavourites);
  }
  async function getFavBooks() {
    const tempBooks: Book[] = [];
    const bookData: DocumentData[] = []; // initialize to empty array

    favourites?.forEach((fav) => {
      const bookRef = doc(db, "books", fav);
      const promise = getDoc(bookRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const bookData = docSnapshot.data();
            const book: Book = {
              id: fav,
              author: bookData.author,
              avgProfRating: bookData.avgProfRating,
              avgUserRating: bookData.avgUserRating,
              description: bookData.description,
              numProfRatings: bookData.numProfRatings,
              photo: bookData.photo,
              title: bookData.title,
              numUserRatings: bookData.numUserRatings,
            };
            tempBooks.push(book);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
      bookData.push(promise); // add each promise to the array
    });

    await Promise.all(bookData); // wait for all promises to resolve
    setFavBooks(tempBooks);
  }

  // async function getFavBooks() {
  //   const tempBooks: Book[] = [];
  //   favourites?.forEach((fav) => {
  //     const bookRef = doc(db, "books", fav);
  //     getDoc(bookRef)
  //       .then((docSnapshot) => {
  //         if (docSnapshot.exists()) {
  //           const bookData = docSnapshot.data();
  //           // console.log(fav);
  //           const book: Book = {
  //             id: fav,
  //             author: bookData.author,
  //             avgProfRating: bookData.avgProfRating,
  //             avgUserRating: bookData.avgUserRating,
  //             description: bookData.description,
  //             numProfRatings: bookData.numProfRatings,
  //             photo: bookData.photo,
  //             title: bookData.title,
  //             numUserRatings: bookData.numUserRatings,
  //           };
  //           tempBooks.push(book);
  //         } else {
  //           console.log("No such document!");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error getting document:", error);
  //       });
  //     setFavBooks(tempBooks);
  //   });
  // }

  useEffect(() => {
    console.log("hei");
    if (props.uid) {
      getUserFavourites();
    }
  }, [props.uid]);

  useEffect(() => {
    console.log("hei");
    getFavBooks();
  }, [favourites]);

  return (
    <>
      <div>Favourite books:</div>
      {favBooks == undefined ? (
        <div>Laster favoritter...</div>
      ) : (
        favBooks.map((f: Book, i) => {
          console.log(f);
          return <SingleBook key={i} book={f} />;
        })
        // favourites.map((fav, index) => {
        //   return <span key={index}>{fav}</span>;
        // })
      )}
    </>
  );
}
