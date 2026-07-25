import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdViYJhxVxMcb0gN5WpNWv6jxgDuJs_Gg",
    authDomain: "unievent123-77d01.firebaseapp.com",
    projectId: "unievent123-77d01",
    storageBucket: "unievent123-77d01.firebasestorage.app",
    messagingSenderId: "21875171361",
    appId: "1:21875171361:web:108e6d64051e78ffb9c360"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export {
    collection,
    addDoc,
    getDocs
};