import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyC7N0nTOzmeM0qR2Ve0wP_SMlrvbI_D-SU",
    authDomain: "photo-galery-848.firebaseapp.com",
    databaseURL: "https://photo-galery-848-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "photo-galery-848",
    storageBucket: "photo-galery-848.appspot.com",
    messagingSenderId: "1070116888299",
    appId: "1:1070116888299:web:1682d399a5b77e8c4f28ae"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)
  const storage = getStorage(app)

  export {db, storage}