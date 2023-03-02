import React, { useState, FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import "./Styles.css";
import { collection, getDocs } from "firebase/firestore";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      console.log(user);
      navigate("/");
      // ...
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
    }
  };

  return (
    <main className="mainLogin">
      <section className="sectionLogin">
        <div>
          <div>
            <h1 className="headerLogin">IBDB</h1>
            <form className="formLogin" onSubmit={onSubmit}>
              <div>
                <label className="labelLogin" htmlFor="email-address">
                  Email address
                </label>
                <input
                  className="inputLogin"
                  type="email"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="labelLogin" htmlFor="password">
                  Password
                </label>
                <input
                  className="inputLogin"
                  type="password"
                  aria-label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              <button className="buttonLogin" type="submit">
                Sign up
              </button>
            </form>

            <p className="noAccLogin">
              Already have an account? <NavLink to="/login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
