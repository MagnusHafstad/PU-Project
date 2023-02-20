import { getDocs } from "firebase/firestore";

export async function fetchBook() {
  getDocs(colRef).then((snapshot) => {
    setook(
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
