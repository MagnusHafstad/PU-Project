import React, { useEffect, useState } from "react";
import { Book } from "../types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import CompactSingleBook from "./CompactSingleBook";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function BookList() {
  const colRef = collection(db, "books");

  const [books, setBooks] = React.useState<Book[] | undefined>();
  const [defaultOption, setDefaultOption] = useState("Alle");
  const [genres, setGenres] = React.useState<string[]>();

  async function fetchBooks() {
    getDocs(colRef).then((snapshot) => {
      setBooks(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.get("title"),
            author: doc.get("author"),
            description: doc.get("description"),
            photo: doc.get("photo"),
            avgUserRating: doc.get("avgUserRating"),
            numUserRatings: doc.get("numUserRatings"),
            avgProfRating: doc.get("avgProfRating"),
            numProfRatings: doc.get("numProfRatings"),
          };
        })
      );
    });
  }

  useEffect(() => {
    fetchBooks();
    console.log(defaultOption);
  }, []);

  useEffect(() => {
    books?.map((b) => getBookGenre(b.id));
  }, [books]);

  const options = ["Alle", "Narnia", "fantasy"];

  function handleDropdownChange(selectedOption: any) {
    setDefaultOption(selectedOption.value);
  }

  function compareBooks(a: Book, b: Book) {
    if (a.avgUserRating === undefined || b.avgUserRating === undefined) {
      return 0;
    }
    if (a.avgUserRating > b.avgUserRating) {
      return -1;
    }
    if (a.avgUserRating < b.avgUserRating) {
      return 1;
    }
    return 0;
  }

  async function getBookGenre(bookID: string) {
    const genresTemp: string[] = [];
    const genreRef = collection(db, "books/" + bookID + "/genres");
    const snapshot = await getDocs(genreRef);
    snapshot.docs.map((doc) => {
      genresTemp.push(doc.get("genre"));
    });
    setGenres(genresTemp);
  }

  function hasGenre(bookId: string, defaultOption: string) {
    const genreRef = collection(db, "books/" + bookId + "/genres");
    const q = query(genreRef, where("genre", "==", defaultOption));
    getDocs(q).then((snapshot) => {
      console.log(snapshot.docs.length);
      if (snapshot.docs.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  }

  return (
    <>
      <div className="BookList">
        <h1 className="ListTitle">Topplister</h1>
        <Dropdown
          options={options.map((option) => ({ value: option, label: option }))}
          onChange={handleDropdownChange}
          value={{ value: defaultOption, label: defaultOption }}
          placeholder="Filter by category"
        />
        {books == undefined ? (
          <div>Loading...</div>
        ) : (
          <>
            {books
              .sort(compareBooks)
              .filter((book) => defaultOption === "Alle" || genres?.includes(defaultOption)) //hasGenre(book.id, defaultOption)) //
              .map((book) => (
                <CompactSingleBook key={book.id} book={book} />
              ))}
          </>
        )}
      </div>
    </>
  );
}
