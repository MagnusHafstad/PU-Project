import React, { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import "./Styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // Popup message when typing wrong password
        window.alert("Wrong password or username. Try again");
      });
  };

  return (
    <>
      <main className="mainLogin">
        <section className="sectionLogin">
          <div>
            <h1 className="headerLogin"> IBDB </h1>

            <form className="formLogin" onSubmit={onLogin}>
              <div>
                <label className="labelLogin " htmlFor="email-address">
                  Email address
                </label>
                <input
                  className="inputLogin"
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="labelLogin" htmlFor="password">
                  Password
                </label>
                <input
                  className="inputLogin"
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="buttonLogin" type="submit">
                Login
              </button>
            </form>

            <p className="noAccLogin">
              No account yet? <NavLink to="/signup">Sign up</NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
