import { profile } from "console";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import React from "react";

export default function NavBar() {
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");
  function getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUsername(user.email);
        setProfileLink("/Profile/" + user.uid);
      } else {
        setUsername(null);
      }
    });
  }

  useEffect(() => {
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
