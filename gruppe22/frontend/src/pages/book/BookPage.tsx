import { collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { Book } from "../../types";

export default function BookPage() {
  const { bookID } = useParams();
  const colRef = collection(db, "books");

  const [book, setBook] = React.useState<Book | undefined>();

  let currentBook: Book = {
    id: "",
    title: "",
    author: "",
    description: "",
  };

  const paragraphs = currentBook.description.match(/[^\r\n]+/g);

  async function fetchBook() {
    getDocs(colRef).then((snapshot) => {
      setBook(
        (currentBook = {
          id: { bookID },
          title: snapshot.docs.find((doc) => doc.id == bookID)?.get("title"),
          author: snapshot.docs.find((doc) => doc.id == bookID)?.get("author"),
          description: snapshot.docs.find((doc) => doc.id == bookID)?.get("description"),
        })
      );
    });
  }

  useEffect(() => {
    fetchBook();
  }, []);

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

  //return; // <div>This is a book page for {book?.title}
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
            <p>
              by:&nbsp;
              <i>
                <span className="BookInfo">{book.author}</span>
              </i>
            </p>
            <Paragraph />
          </div>
        )}
      </div>
    </>
  );
}
