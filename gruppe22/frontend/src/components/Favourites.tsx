import React, { useEffect } from "react";
import { Book } from "../types";
import SingleBook from "./SingleBook";
import { collection, doc, DocumentData, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";
import CompactSingleBook from "./CompactSingleBook";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Button } from "@mui/material";
// import FavouriteBook from "./FavouriteBook";

export default function Favourites(props: { uid: string }) {
  const [favBooks, setFavBooks] = React.useState<Book[] | undefined>();
  const [showAll, setShowAll] = React.useState<boolean>();
  const [favourites, setFavourites] = React.useState<string[] | undefined>();
  // const bookRef = collection(db, "books");

  async function getUserFavourites() {
    const favRef = collection(db, "users/" + props.uid.toString() + "/favourites");
    const tempFavourites: string[] = [];
    const snapshot = await getDocs(favRef);
    snapshot.docs.map((doc) => {
      tempFavourites.push(doc.get("bookID"));
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

  async function loadAllFavs() {
    setShowAll(true);
  }

  async function loadOnlyOne() {
    setShowAll(false);
  }

  useEffect(() => {
    console.log("hei");
    if (props.uid) {
      getUserFavourites();
    }
    console.log(favBooks);
  }, [props.uid]);

  useEffect(() => {
    console.log("hei");
    getFavBooks();
  }, [favourites]);

  return (
    <>
      <div className="FavBookList">
        <h1 className="FavTitle">Your favorite books:</h1>
        {favBooks == undefined || favBooks.length == 0 ? (
          <>
            <div>You have not favorited any books yet</div>
          </>
        ) : showAll ? (
          favBooks.map((f: Book, i) => {
            return <CompactSingleBook key={i} book={f} />;
          })
        ) : (
          <>
            <CompactSingleBook book={favBooks[0]}></CompactSingleBook>
            {/* <Button variant="contained" onClick={loadAllFavs}>
              Show all favourites...
            </Button> */}
          </>
        )}
        {showAll ? (
          <Button variant="contained" onClick={loadOnlyOne}>
            Hide Favourites
          </Button>
        ) : (
          <Button variant="contained" onClick={loadAllFavs}>
            Show all favourites...
          </Button>
        )}
      </div>
    </>
  );
}
