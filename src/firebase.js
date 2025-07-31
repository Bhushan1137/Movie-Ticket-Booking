import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYzn82NFSiUF8SzPPJWPOprn37_WJZ1dQ",
  authDomain: "ticket-booking-app-25800.firebaseapp.com",
  projectId: "ticket-booking-app-25800",
  storageBucket: "ticket-booking-app-25800.firebasestorage.app",
  messagingSenderId: "590895302584",
  appId: "1:590895302584:web:6cccd722b498b830df714d",
  measurementId: "G-PY2FX65D30"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const  auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};