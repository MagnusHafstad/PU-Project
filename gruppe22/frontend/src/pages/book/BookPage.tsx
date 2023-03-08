import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import React, { useEffect } from "react";
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
  });

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
    photo: "",
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
        })
      );
    });
  }

  useEffect(() => {
    fetchBook();
    getUser();
    fetchAdmin();
    // fetchImage();
  }, []);

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

  //the code below is for checking if user is admin or not
  const colAdm = collection(db, "admin");

  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
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

  //return; // <div>This is a book page for {book?.title}
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
        {checkAdmin() ? <EditButton /> : <></>}
      </div>
    </>
  );
}
