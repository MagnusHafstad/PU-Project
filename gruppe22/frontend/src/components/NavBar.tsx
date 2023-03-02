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
  const [admins, setAdmins] = React.useState<Admin[]>();
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");
  //   const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  async function fetchAdmin() {
    // const temp_admins: Admin[] = [];
    // getDocs(colRef).then((snapshot) => {
    //   setAdmins(
    //     snapshot.docs.map((doc) => {
    //       return {
    //         uid: doc.get("uid"),
    //       };
    //     })
    //   );
    // });
    // setAdmins(temp_admins);
    // console.log(admins);
    // console.log(uid);
    let user: string = "";
    getDocs(colRef).then((snapshot) => {
      user = snapshot.docs
        .find((doc) => {
          doc.get("uid") == uid;
        })
        ?.get("uid");
    });

    if (user == uid) {
      console.log("YAY");
    }
    // console.log(admins[0] == uid);
    // if (admins?.includes(uid)) {
    //   console.log("test");
    //   sessionStorage.setItem("usertype", "admin");
    // } else {
    //   console.log("HEI");
    // }
  }

  //   function checkAdmin() {
  //     if (admins?.includes(uid)) {
  //       setIsAdmin(true);
  //     } else {
  //       setIsAdmin(false);
  //     }
  //   }

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
    getUser();
    fetchAdmin();
    // checkAdmin();
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
        {/* {isAdmin ? <button>AdminPage</button> : ""} */}
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
