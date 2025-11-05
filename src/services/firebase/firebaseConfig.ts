// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBY8XBhEnD_EUlmqE54w_jqDbP7gpwgGy8",
    authDomain: "vivahsetu-4eec1.firebaseapp.com",
    projectId: "vivahsetu-4eec1",
    storageBucket: "vivahsetu-4eec1.firebasestorage.app",
    messagingSenderId: "740740268985",
    appId: "1:740740268985:web:5f73e4825a821eddafec68"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
