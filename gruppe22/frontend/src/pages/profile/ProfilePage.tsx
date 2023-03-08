import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { check } from "prettier";
import React from "react";
import { useEffect } from "react";
import AdminButton from "../../components/AdminButton";
import admButton from "../../components/AdminButton";
import SignOut from "../../components/SignOut";
import { db } from "../../firebase-config";
import { Admin } from "../../types";

export default function ProfilePage() {
  const colRef = collection(db, "admin");

  const [admins, setAdmins] = React.useState<Admin[] | undefined>();
  const [uid, setUid] = React.useState<string>("");
  const [username, setUsername] = React.useState<string | null>();

  async function fetchAdmin() {
    console.log(uid);
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
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p>{username}</p>
      <p>{uid}</p>
      <p>
        {admins?.map((a) => {
          return a.uid;
        })}
      </p>
      <SignOut />
      {checkAdmin() ? <AdminButton /> : ""};
    </div>
  );
}
