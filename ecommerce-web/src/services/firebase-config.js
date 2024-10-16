import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCup2T3B1SB_wt5_l3tGdj6-s84AwxexMM",
  authDomain: "project-ead-8ce1d.firebaseapp.com",
  projectId: "project-ead-8ce1d",
  storageBucket: "project-ead-8ce1d.appspot.com",
  messagingSenderId: "408262750933",
  appId: "1:408262750933:web:0052d20772524406f6a85c",
  measurementId: "G-TSGBRFZ17C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };