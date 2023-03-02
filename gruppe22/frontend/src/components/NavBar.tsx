import { profile } from "console";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export default function NavBar() {
  const colRef = collection(db, "admin");
  const [uid, setUid] = React.useState<string>();
  const [admin, setAdmin] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");

  async function fetchAdmin() {
    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.get("uid") == uid) {
          setAdmin(true);
        }
      });
    });
  }

  function getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUsername(user.email);
        setProfileLink("/Profile/" + user.uid);
        setUid(user.uid);
      } else {
        setUsername(null);
      }
    });
  }

  useEffect(() => {
    getUser();
    fetchAdmin();
  }, []);
  return (
    <nav className="navigationBar">
      <div>
        <Link to="/" className="homeLink">
          <span className="heading">IBDB</span>
        </Link>
        <Link to="/FindBooks" className="findBooksLink">
          FindBooks
        </Link>
        {admin ? <button>AdminPage</button> : ""}
        {username ? (
          <button className="loginPageLink">
            <Link className="findBooksLink" to={profileLink}>
              Profile
            </Link>
          </button>
        ) : (
          <button className="loginPageLink">
            <Link className="findBooksLink" to="/login">
              Login
            </Link>
          </button>
        )}
      </div>
    </nav>
  );
}
