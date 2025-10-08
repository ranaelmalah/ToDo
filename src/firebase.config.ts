import { initializeApp } from "firebase/app";
import{getAuth}from'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
     apiKey: "AIzaSyBk2krPuQyi9R_2wRpB--fhYPGsaGFz08Q",
     authDomain: "to-do-58e5a.firebaseapp.com",
     projectId: "to-do-58e5a",
        storageBucket: "to-do-58e5a.firebasestorage.app",
        messagingSenderId: "825457079560",
        appId: "1:825457079560:web:4a3b7aed8690a120e8e8bd",
        measurementId: "G-BFSETGHKP3"
}

const app =initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
