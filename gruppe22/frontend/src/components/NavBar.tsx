import { profile } from "console";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Admin } from "../types";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Button } from "@mui/material";

export default function NavBar() {
  const colRef = collection(db, "admin");
  const [uid, setUid] = React.useState<string>("");
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");

  //function that retieves all the data from "admins" collection
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

  //Function that retrieves the user with the uid for the logged in user
  function getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        //code that is executed if there is a user logged in
        setUsername(user.email);
        setUid(user.uid);
        //sets the link to the profile of the user
        setProfileLink("/Profile/" + user.uid);
      } else {
        //code that is executed if there is noe user logged in
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
          Find books
        </Link>
      </div>

      <div className="profileButtonDiv">
        {/* checks if a user is logged in and renders the navbar with either "login" or "profile"  */}
        {username ? (
          <Button className="profilePageButton" variant="contained">
            <Link className="profileButtonLink" to={profileLink}>
              Profile
            </Link>
          </Button>
        ) : (
          <Button variant="contained" className="loginPageButton">
            <Link className="loginButtonLink" to="/login">
              Login
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
