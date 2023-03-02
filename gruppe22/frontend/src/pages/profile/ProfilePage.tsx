import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useEffect } from "react";
import SignOut from "../../components/SignOut";

export default function ProfilePage() {
  const [username, setUsername] = React.useState<string | null>();
  const [profileLink, setProfileLink] = React.useState<string>("");
  function getUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUsername(user.email);
        setProfileLink("/Profile/" + user.uid);
      }
    });
  }

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      <h1>Profile</h1>
      <p>{username}</p>
      <SignOut />
    </div>
  );
}
