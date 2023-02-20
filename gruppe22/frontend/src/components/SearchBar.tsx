import React from "react";
import { algoliaClient, algoliaIndex } from "../firebase-config";
import { InstantSearch, Hits, SearchBox, Highlight, Snippet } from "react-instantsearch-dom";
import { Book } from "../types";
import BookHit from "./BookHit";
import SingleBook from "./SingleBook";

type HitProps = {
  hit: Book;
};

/*
function Hit({ hit }: HitProps) {
  return (
    <div>
      <div>
        <Highlight attribute="title" hit={hit} />
      </div>
      <div>
        <Snippet attribute="description" hit={hit} />
      </div>
    </div>
  );
}
*/

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
