import { collection, getDocs, runTransaction, doc, where, query } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { Book } from "../../types";
import { storage } from "../../firebase-config";
import { Admin } from "../../types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditButton from "../../components/EditButton";

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
  });

  const ratingInputRef = useRef<HTMLInputElement>(null);

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
    avgUserRating: 0,
    numUserRatings: 0,
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
      return { __html: book.description.replace(/Newline/g, "<br /> <br /> ") };
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
        //legg til bruker-id også
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

  //the code below is for checking if user is admin or not
  const colAdm = collection(db, "admin");
  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
  const [hasRated, setHasRated] = React.useState<boolean>(false);
  const [userRating, setUserRating] = React.useState<number>();
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

  //checks if user is admin
  function checkAdmin() {
    if (admins?.find((a) => a.uid == uid)) {
      return true;
    } else {
      return false;
    }
  }

  //find user and setsd uid to user.uid
  function getUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        // setUsername(user.email);
        setUid(user.uid);
      }
    });
  }

  // finds the rating the logged in user has given the book
  function getUserRating() {
    const ratingRef = collection(db, "books/" + bookID + "/userRatings");
    const q = query(ratingRef, where("userID", "==", uid));
    getDocs(q).then((snapshot) => {
      setUserRating(snapshot.docs[0]?.get("rating"));
    });
  }

  //write a funtion to check if a user has already rated a book
  //if so, the rating should be displayed and the user should be able to change it
  //if not, the user should be able to add a rating

  //checks if user has rated a book
  async function checkRating() {
    const ratingRef = collection(db, "books/" + bookID + "/userRatings");
    const q = query(ratingRef, where("userID", "==", uid));
    getDocs(q).then((snapshot) => {
      if (snapshot.docs.length > 0) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    });
    //setHasRated(false);
  }

  useEffect(() => {
    fetchBook();
    getUser();
    fetchAdmin();
    checkRating();
    getUserRating();
  }, []);

  fetchBook();
  getUser();
  fetchAdmin();
  checkRating();
  getUserRating();

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
          {uid ? (
            hasRated ? (
              <div> Your rating: {userRating}</div>
            ) : (
              <div>
                <label htmlFor="Rating">Rating</label>
                <input id="Rating" name="Rating" type="number" min="0" max="10" step="1" ref={ratingInputRef} />
                <button onClick={handleAddRating}>Add Rating</button>
              </div>
            )
          ) : (
            <></>
          )}
        </div>
        {checkAdmin() ? <EditButton /> : <></>}
      </div>
    </>
  );
}
