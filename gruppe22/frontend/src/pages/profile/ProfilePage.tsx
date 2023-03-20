import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { check } from "prettier";
import React from "react";
import { useEffect } from "react";
import AdminButton from "../../components/AdminButton";
import admButton from "../../components/AdminButton";
import BookList from "../../components/BookList";
import Favourites from "../../components/Favourites";
import SignOut from "../../components/SignOut";
import { db } from "../../firebase-config";
import { Admin, Book } from "../../types";
import "./ProfilePage.css";

export default function ProfilePage() {
  const colRef = collection(db, "admin");

  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
  const [username, setUsername] = React.useState<string | null>();

  async function fetchAdmin() {
    getDocs(colRef).then((snapshot) => {
      setAdmins(
        snapshot.docs.map((doc) => {
          return {
            uid: doc.get("uid"),
          };
        })
      );
    });
  }

  //checks if user is admin
  function checkAdmin() {
    if (admins?.find((a) => a.uid == uid)) {
      return true;
    } else {
      return false;
    }
  }

  function getUser() {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUsername(user.email);
        setUid(user.uid);
      }
    });
  }

  useEffect(() => {
    getUser();
    fetchAdmin();
    checkAdmin();
  }, [uid]);

  return (
    <div className="ProfilePage">
      <div className="ProfileInfo">
        <h1>Profile</h1>
        <p>
          <span className="UserInfo">Email:</span> {username}
        </p>
        <div className="Buttons">
          {" "}
          <SignOut />
        </div>
        {checkAdmin() ? <AdminButton /> : ""}
      </div>
      <div className="FavouriteList">{uid && <Favourites uid={uid} />}</div>
    </div>
  );
}
