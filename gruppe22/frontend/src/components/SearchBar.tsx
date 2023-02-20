import React from "react";
import { algoliaClient, algoliaIndex } from "../firebase-config";
import { InstantSearch, Hits, SearchBox, Highlight, Snippet, connectHits } from "react-instantsearch-dom";
import { Book } from "../types";
import BookHit from "./BookHit";
import SingleBook from "./SingleBook";
import "./Styles.css";

export default function SearchBar() {
  return (
    <div className="Search">
      <h1>Find your favorite books</h1>
      <InstantSearch indexName="ibdb" searchClient={algoliaClient}>
        <div className="right-panel">
          <SearchBox />
          <Hits hitComponent={BookHit} />
        </div>
      </InstantSearch>
    </div>
  );
}
