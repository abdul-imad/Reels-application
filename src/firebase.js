import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const object = require("./secrets");
firebase.initializeApp(object);

let auth = firebase.auth();
export default auth;
export const storage = firebase.storage();
export const db = firebase.firestore();

export const database = {
	users: db.collection("users"),
	posts: db.collection("posts"),
	getTimeStamp: firebase.firestore.FieldValue.serverTimestamp,
};
