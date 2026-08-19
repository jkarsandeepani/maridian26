import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBT5J_doG1U4sXcWNgCxIt6_w6d0S4J5kQ",
    authDomain: "maridian26.firebaseapp.com",
    projectId: "maridian26",
    storageBucket: "maridian26.firebasestorage.app",
    messagingSenderId: "518827182105",
    appId: "1:518827182105:web:445b60a877bc0198ac0288",
    measurementId: "G-TVZHMRYZH7"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
};