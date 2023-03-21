import {
  collection,
  getDocs,
  runTransaction,
  doc,
  where,
  query,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { Book, Prof } from "../../types";
import { storage } from "../../firebase-config";
import { Admin } from "../../types";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import EditButton from "../../components/EditButton";
import "./BookPage.css";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Button } from "@mui/material";

export default function BookPage() {
  const { bookID } = useParams();
  const colRef = collection(db, "books");

  const [book, setBook] = React.useState<Book>({
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
    avgUserRating: 0,
    numUserRatings: 0,
    avgProfRating: 0,
    numProfRatings: 0,
  });

  const ratingInputRef = useRef<HTMLInputElement>(null);
  const profRatingInputRef = useRef<HTMLInputElement>(null);

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
    avgUserRating: 0,
    numUserRatings: 0,
    avgProfRating: 0,
    numProfRatings: 0,
  };

  async function fetchBook() {
    getDocs(colRef).then((snapshot) => {
      setBook(
        (currentBook = {
          id: { bookID },
          title: snapshot.docs.find((doc) => doc.id == bookID)?.get("title"),
          author: snapshot.docs.find((doc) => doc.id == bookID)?.get("author"),
          description: snapshot.docs.find((doc) => doc.id == bookID)?.get("description"),
          photo: snapshot.docs.find((doc) => doc.id == bookID)?.get("photo"),
          avgUserRating: snapshot.docs.find((doc) => doc.id == bookID)?.get("avgUserRating"),
          numUserRatings: snapshot.docs.find((doc) => doc.id == bookID)?.get("numUserRatings"),
          avgProfRating: snapshot.docs.find((doc) => doc.id == bookID)?.get("avgProfRating"),
          numProfRatings: snapshot.docs.find((doc) => doc.id == bookID)?.get("numProfRatings"),
        })
      );
    });
  }

  const [imageURL, setImageURL] = React.useState("");
  async function fetchImage() {
    if (book !== undefined) {
      // had to add the if-sentence to get rid of eslint error-message. However, the if in itself does nothing
      let photoName: string = book.photo;

      if (book.photo == null) {
        photoName = "no_image.jpg";
      }
      const reference = ref(storage, "images/" + photoName);
      getDownloadURL(reference).then((url) => {
        setImageURL(url);
      });
    }
    return;
  }
  fetchImage();
  //Keeps newline in HTML conversion
  function paragraphise() {
    if (book !== undefined) {
      return { __html: book.description.replace(/Newline/g, "<br /> <br /> ").replace("\n", "<br /> <br /> ") };
    } else return { __html: "no book" };
  }

  //Forces Html
  const Paragraph: React.FC = () => {
    return <p dangerouslySetInnerHTML={paragraphise()} />;
  };

  async function addRating(rating: number) {
    const bookRef = doc(db, "books/" + bookID);
    const ratingRef = collection(db, "books/" + bookID + "/userRatings");

    return runTransaction(db, (transaction) => {
      return transaction.get(bookRef).then((res) => {
        if (!res.exists()) {
          throw "Document does not exist!";
        }

        // Setting the first rating of a book
        if (res.data().numUserRatings === 0) {
          transaction.update(bookRef, {
            numUserRatings: 1,
            avgUserRating: rating,
          });
        } else {
          // Compute new number of ratings
          const newNumRatings = res.data().numUserRatings + 1;

          // Compute new average rating
          const oldRatingTotal = res.data().avgUserRating * res.data().numUserRatings;
          const newAvgRating = (oldRatingTotal + rating) / newNumRatings;

          // Commit to Firestore
          transaction.update(bookRef, {
            numUserRatings: newNumRatings,
            avgUserRating: newAvgRating,
          });
        }

        // adding rating to the collection
        const newDoc = doc(ratingRef);
        transaction.set(newDoc, { rating: rating, userID: uid });
        setUserRating(rating);
      });
    });
  }

  async function addProfRating(rating: number) {
    const bookRef = doc(db, "books/" + bookID);
    const ratingRef = collection(db, "books/" + bookID + "/profRatings");

    return runTransaction(db, (transaction) => {
      return transaction.get(bookRef).then((res) => {
        if (!res.exists()) {
          throw "Document does not exist!";
        }

        // Setting the first rating of a book
        if (res.data().numProfRatings === 0) {
          transaction.update(bookRef, {
            numProfRatings: 1,
            avgProfRating: rating,
          });
        } else {
          // Compute new number of ratings
          const newNumRatings = res.data().numProfRatings + 1;

          // Compute new average rating
          const oldRatingTotal = res.data().avgProfRating * res.data().numProfRatings;
          const newAvgRating = (oldRatingTotal + rating) / newNumRatings;

          // Commit to Firestore
          transaction.update(bookRef, {
            numProfRatings: newNumRatings,
            avgProfRating: newAvgRating,
          });
        }

        // adding rating to the collection
        const newDoc = doc(ratingRef);
        transaction.set(newDoc, { rating: rating, userID: uid });
        setProfRating(rating);
      });
    });
  }

  function handleAddRating() {
    const rating = parseInt(ratingInputRef.current?.value || "0");
    //må sjekke innlogging
    if (rating >= 0 && rating <= 10) {
      addRating(rating);
      checkRating();
    } else {
      //Feilhåntering
    }
  }

  function handleAddProfRating() {
    const rating = parseInt(profRatingInputRef.current?.value || "0");
    //må sjekke innlogging
    if (rating >= 0 && rating <= 10) {
      addProfRating(rating);
      checkProfRating();
    } else {
      //Feilhåntering
    }
  }

  //the code below is for checking if user is admin or not
  const colAdm = collection(db, "admin");
  const colProf = collection(db, "professionals");
  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [professionals, setProfessionals] = React.useState<Prof[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
  const [hasRated, setHasRated] = React.useState<boolean>(false);
  const [profHasRated, setProfHasRated] = React.useState<boolean>(false);
  const [userRating, setUserRating] = React.useState<number>();
  const [profRating, setProfRating] = React.useState<number>();
  const [isProf, setIsProf] = React.useState<boolean>(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  // const [username, setUsername] = React.useState<string | null>();

  //fetches admin uids from db
  async function fetchAdmin() {
    console.log(uid);
    getDocs(colAdm).then((snapshot) => {
      setAdmins(
        snapshot.docs.map((doc) => {
          return {
            uid: doc.get("uid"),
          };
        })
      );
    });
  }

  //fetches professionals uids from db
  async function fetchProf() {
    console.log(uid);
    getDocs(colProf).then((snapshot) => {
      setProfessionals(
        snapshot.docs.map((doc) => {
          return {
            uid: doc.get("uid"),
          };
        })
      );
    });
  }

  //checks if user is admin
  function checkAdmin() {
    if (admins?.find((a) => a.uid == uid)) {
      return true;
    } else {
      return false;
    }
  }

  //checks if user is professional
  function checkProf() {
    if (professionals?.find((a) => a.uid == uid)) {
      return true;
    } else {
      return false;
    }
  }

  //find user and setsd uid to user.uid
  async function getUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        // setUsername(user.email);
        setUid(user.uid);
        getFavourites(user.uid);
      }
    });
  }

  // finds the rating the logged in user has given the book
  function getUserRating() {
    //gets regular user rating
    const ratingRef = collection(db, "books/" + bookID + "/userRatings");
    const q = query(ratingRef, where("userID", "==", uid));
    getDocs(q).then((snapshot) => {
      setUserRating(snapshot.docs[0]?.get("rating"));
    });
  }

  function getProfRating() {
    // gets professional user rating
    const profRatingRef = collection(db, "books/" + bookID + "/profRatings");
    const pq = query(profRatingRef, where("userID", "==", uid));
    getDocs(pq).then((snapshot) => {
      setProfRating(snapshot.docs[0]?.get("rating"));
    });
  }

  //write a funtion to check if a user has already rated a book
  //if so, the rating should be displayed and the user should be able to change it
  //if not, the user should be able to add a rating

  //checks if user has rated a book
  function checkRating() {
    const ratingRef = collection(db, "books/" + bookID + "/userRatings");
    const q = query(ratingRef, where("userID", "==", uid));
    getDocs(q).then((snapshot) => {
      if (snapshot.docs.length > 0) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    });
  }

  function checkProfRating() {
    //checks if the user has put in a professional rating
    const profRatingRef = collection(db, "books/" + bookID + "/profRatings");
    const pq = query(profRatingRef, where("userID", "==", uid));
    getDocs(pq).then((snapshot) => {
      if (snapshot.docs.length > 0) {
        setProfHasRated(true);
      } else {
        setProfHasRated(false);
      }
    });
  }

  //code below is used for fetching favourites of user and then checking if the book on the page is in the favourites
  const [favourites, setFavourites] = React.useState<string[] | undefined>();
  const [hasFavourited, setHasFavourited] = React.useState<boolean>(false);

  async function getFavourites(userId: string) {
    //has to wait for fetching user before using uid to fetch users favourites
    const favRef = collection(db, "users/" + userId + "/favourites");
    const tempFavourites: string[] = [];
    const snapshot = await getDocs(favRef);
    snapshot.docs.map((doc) => {
      tempFavourites.push(doc.get("bookID"));
    });
    console.log(tempFavourites);
    setFavourites(tempFavourites);
  }

  async function checkFavourites() {
    if (favourites?.find((fav) => fav == bookID)) {
      setHasFavourited(true);
    } else {
      setHasFavourited(false);
    }
  }

  //function that adds book to favorite in firebase
  async function addFavorite() {
    try {
      const userRef = doc(db, `users/${uid}`);
      const favRef = collection(userRef, "favourites");

      // Create the 'favourites' subcollection if it doesn't exist
      await setDoc(userRef, {}, { merge: true });

      await addDoc(favRef, { bookID });
      setHasFavourited(true);
      console.log("Book added to favorites!");
    } catch (error) {
      console.error("Error adding book to favorites:", error);
    }
  }

  //function that removes book from favorite in firebase
  async function removeFavourite() {
    const favouritesRef = collection(db, `users/${uid}/favourites`);
    const q = query(favouritesRef, where("bookID", "==", bookID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setHasFavourited(false);
  }

  //useeffect for rendering book and (type of) user
  useEffect(() => {
    console.log("in normal useEffect");
    fetchBook();
    getUser();
    fetchAdmin();
    fetchProf();
  }, []);

  //useeffect that gets the rating when uid has been set and hasrated changes
  useEffect(() => {
    console.log("In useeffect userrating");
    getUserRating();
  }, [hasRated, uid]);

  //useeffect that gets the rating when uid has been set and hasrated changes
  useEffect(() => {
    console.log("In useeffect profrating");
    getProfRating();
  }, [profHasRated, uid]);

  //Useeffect that checks whether a user has rated when userRating changes
  useEffect(() => {
    console.log("In useeffect checkrating");
    checkRating();
  }, [userRating]);

  //Useeffect that checks whether the professional user has rated when profRating changes
  useEffect(() => {
    console.log("In useeffect checkprofrating");
    checkProfRating();
  }, [profRating]);

  //useeffect that runs checkfavourites when 'favourites is updated'
  useEffect(() => {
    console.log("in useeffect checkfavourites");
    // getFavourites(uid);
    checkFavourites();
  }, [favourites]);

  return (
    <>
      <div className="BookDetParent">
        <img src={imageURL} className="BookDetPhoto" />
        {book == undefined ? (
          <div>Laster ...</div>
        ) : (
          <div className="BookDetChild">
            <h1 className="BookDetHeader">
              Title: <span className="BookInfo">{book.title}</span>
            </h1>
            <p>
              by:&nbsp;
              <i>
                <span className="BookInfo">{book.author}</span>
              </i>
            </p>
            <Paragraph />
          </div>
        )}
        <div>
          <span> Avgerage user rating: {book?.avgUserRating?.toFixed(1) || "No ratings yet"}</span>
          <br />
          <span> Avgerage professional rating: {book?.avgProfRating?.toFixed(1) || "No ratings yet"}</span>
          <br />
          {uid && !checkProf() ? (
            hasFavourited ? (
              hasRated ? (
                <>
                  <div> Your rating: {userRating}</div>
                  <Button onClick={removeFavourite} variant="contained" color="error">
                    Remove from favourites
                  </Button>
                </>
              ) : (
                <div>
                  <label htmlFor="Rating">Rate the book</label>
                  <input id="Rating" name="Rating" type="number" min="0" max="10" step="1" ref={ratingInputRef} />
                  <button onClick={handleAddRating}>Add Rating</button>{" "}
                  <Button onClick={removeFavourite} variant="contained" color="error">
                    Remove from favourites
                  </Button>
                </div>
              )
            ) : hasRated ? (
              <>
                <div> Your rating: {userRating}</div>
                <Button onClick={addFavorite} variant="contained">
                  Add to favourites
                </Button>
              </>
            ) : (
              <div>
                <label htmlFor="Rating">Rate the book</label>
                <input id="Rating" name="Rating" type="number" min="0" max="10" step="1" ref={ratingInputRef} />
                <button onClick={handleAddRating}>Add Rating</button>
                <Button onClick={addFavorite} variant="contained">
                  Add to favourites
                </Button>
              </div>
            )
          ) : (
            <></>
          )}
          {uid && checkProf() ? (
            hasFavourited ? (
              profHasRated ? (
                <>
                  <div> Your rating: {profRating}</div>
                  <Button onClick={removeFavourite} variant="contained" color="error">
                    Remove from favourites
                  </Button>
                </>
              ) : (
                <div>
                  <label htmlFor="Rating">Rate the book</label>
                  <input id="Rating" name="Rating" type="number" min="0" max="10" step="1" ref={profRatingInputRef} />
                  <button onClick={handleAddProfRating}>Add Rating</button>{" "}
                  <Button onClick={removeFavourite} variant="contained" color="error">
                    Remove from favourites
                  </Button>
                </div>
              )
            ) : profHasRated ? (
              <>
                <div> Your rating: {profRating}</div>
                <Button onClick={addFavorite} variant="contained">
                  Add to favourites
                </Button>
              </>
            ) : (
              <div>
                <label htmlFor="Rating">Rate the book</label>
                <input id="ProfRating" name="Rating" type="number" min="0" max="10" step="1" ref={profRatingInputRef} />
                <button onClick={handleAddProfRating}>Add Rating</button>
                <Button onClick={addFavorite} variant="contained">
                  Add to favourites
                </Button>
              </div>
            )
          ) : (
            <></>
          )}

          {/* {uid && checkProf()
           ? (
            hasFavourited ? (profHasRated ? (
              <>
              <div> Your professional rating: {profRating}</div>
              <Button onClick={removeFavourite} variant="contained" color="error">
              Remove from favourites
            </Button></>
            ) : (
              <div>
                <label htmlFor="Rating">Rate the book</label>
                <input id="ProfRating" name="Rating" type="number" min="0" max="10" step="1" ref={profRatingInputRef} />
                <button onClick={handleAddProfRating}>Add professional rating</button>
                <Button onClick={removeFavourite} variant="contained" color="error">
                    Remove from favourites
                  </Button>
              </div>
            )) : (profHasRated ? (
              <><div> Your professional rating: {profRating}</div>
              <Button onClick={addFavorite} variant="contained">
              Add to favourites
            </Button></>
            ) : (
              <div>
                <label htmlFor="Rating">Rate the book</label>
                <input id="ProfRating" name="Rating" type="number" min="0" max="10" step="1" ref={profRatingInputRef} />
                <button onClick={handleAddProfRating}>Add professional rating</button>
                <Button onClick={addFavorite} variant="contained">
                  Add to favourites
                </Button>
              </div>
            ))
            
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </>
  );
}

//  {
//    uid ? (
//      !checkProf ? (
//        hasRated ? (
//          <div> Your rating: {userRating}</div>
//        ) : (
//          <div>
//            <label htmlFor="Rating">Rate the book</label>
//            <input id="Rating" name="Rating" type="number" min="0" max="10" step="1" ref={ratingInputRef} />
//            <button onClick={handleAddRating}>Add Rating</button>
//          </div>
//        )
//      ) : profHasRated ? (
//        <div> Your professional rating: {profRating}</div>
//      ) : (
//        <div>
//          <label htmlFor="Rating">Rate the book</label>
//          <input id="ProfRating" name="Rating" type="number" min="0" max="10" step="1" ref={profRatingInputRef} />
//          <button onClick={handleAddProfRating}>Add professional rating</button>
//        </div>
//      )
//    ) : (
//      <></>
//    );
//  }
