import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "./firebase-config";
import { Admin } from "./types";
