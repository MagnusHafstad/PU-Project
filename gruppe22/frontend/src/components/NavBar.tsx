import { profile } from "console";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Admin } from "../types";

export default function NavBar() {
  const colRef = collection(db, "admin");
  const [uid, setUid] = React.useState<string>("");
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");

  async function fetchAdmin() {
    let user = "";
    getDocs(colRef).then((snapshot) => {
      user = snapshot.docs
        .find((doc) => {
          doc.get("uid") == uid;
        })
        ?.get("uid");
    });
  }

  function getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUsername(user.email);
        setUid(user.uid);
        setProfileLink("/Profile/" + user.uid);
      } else {
        setUsername(null);
        setUid("");
        setProfileLink("");
      }
    });
  }

  useEffect(() => {
    fetchAdmin();
    getUser();
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
