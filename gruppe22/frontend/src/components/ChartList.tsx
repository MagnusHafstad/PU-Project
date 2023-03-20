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
  const [defaultOption, setDefaultOption] = useState("All");
  const [genres, setGenres] = React.useState<string[]>();
  const [chartBooks, setChartBooks] = React.useState<Book[] | undefined>();

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

  //sets genres to the unique genres from the sub-collection on each book
  async function getBookGenre() {
    const genresSet: Set<string> = new Set();
    if (books && books.length > 0) {
      await Promise.all(
        books.map(async (b) => {
          const genreRef = collection(db, "books/" + b.id + "/genres");
          const snapshot = await getDocs(genreRef);
          snapshot.docs.forEach((doc) => {
            genresSet.add(doc.get("genre"));
          });
        })
      );
      setGenres(Array.from(genresSet)); // convert the set back to an array and set it as the state
    }
  }

  async function hasGenre() {
    const tempChartBooks: Book[] = [];
    if (books && books.length > 0) {
      await Promise.all(
        books.map(async (b) => {
          const genreRef = collection(db, "books/" + b.id + "/genres");
          const snapshot = await getDocs(genreRef);
          snapshot.docs.forEach((doc) => {
            if (doc.get("genre") == defaultOption) {
              tempChartBooks.push(b);
            }
          });
        })
      );
      setChartBooks(tempChartBooks);
    }
  }

  useEffect(() => {
    fetchBooks();
    console.log(defaultOption);
  }, []);

  useEffect(() => {
    console.log("get genres");
    console.log(genres);
    getBookGenre();
  }, [books]);

  useEffect(() => {
    hasGenre();
  }, [defaultOption]);

  return (
    <>
      <div className="BookList">
        <h1 className="ListTitle">Topplister</h1>
        {genres != undefined && genres.length != 0 ? (
          <Dropdown
            options={genres.map((genre) => ({ value: genre, label: genre }))}
            onChange={handleDropdownChange}
            value={{ value: defaultOption, label: defaultOption }}
            placeholder="Filter by category"
          />
        ) : (
          <div>Loading dropdown...</div>
        )}

        {books == undefined ? (
          <div>Loading...</div>
        ) : (
          <>
            {chartBooks != undefined && chartBooks.length != 0 ? (
              chartBooks.sort(compareBooks).map((book) => <CompactSingleBook key={book.id} book={book} />)
            ) : defaultOption == "All" ? (
              books.sort(compareBooks).map((book) => <CompactSingleBook key={book.id} book={book} />)
            ) : (
              <div>No books with this genre</div>
            )}
          </>
        )}
      </div>
    </>
  );
}
