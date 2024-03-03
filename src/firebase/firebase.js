import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCdg0uv67ElQdwOdhyaqTK4mq6q_J97hZs",
	authDomain: "the-campus-bridge.firebaseapp.com",
	projectId: "the-campus-bridge",
	storageBucket: "the-campus-bridge.appspot.com",
	messagingSenderId: "547471585441",
	appId: "1:547471585441:web:ea774c15a05904f76740e0",
	measurementId: "G-TZMCTY70VS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
