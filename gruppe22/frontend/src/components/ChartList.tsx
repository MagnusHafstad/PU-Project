import React, { useEffect, useState } from "react";
import { Book } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import CompactSingleBook from "./CompactSingleBook";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function BookList() {
  const colRef = collection(db, "books");

  const [books, setBooks] = React.useState<Book[] | undefined>();
  const [defaultOption, setDefaultOption] = useState("All");

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
  }, []);

  const options = ["Alle", "Narnia", "Fantasy"];

  const handleDropdownChange = (selectedOption: any) => {
    setDefaultOption(selectedOption.value);
  };

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

  return (
    <>
      <div className="ChartBookList">
        <h1 className="ListTitle">Topplister</h1>
        <Dropdown
          className="Dropdown"
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
              .filter((book) => defaultOption === "Alle" || book.title === defaultOption) //book.title is a test of the filter function. Should be genra
              .map((book) => (
                <CompactSingleBook key={book.id} book={book} />
              ))}
          </>
        )}
      </div>
    </>
  );
}
