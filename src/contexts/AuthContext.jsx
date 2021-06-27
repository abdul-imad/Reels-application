import React, { useEffect, useState } from "react";
import auth from "../firebase";
export const AuthContext = React.createContext();
export function AuthProvider({ children }) {
	console.log("Auth context");
	const [currentUser, setUser] = useState();
	const [loader, setLoader] = useState(true);
	async function login(email, password) {
		return await auth.signInWithEmailAndPassword(email, password);
	}
	async function signOut() {
		return await auth.signOut();
	}
	async function signUp(email, password) {
		return await auth.createUserWithEmailAndPassword(email, password);
	}
	console.log(loader);
	useEffect(() => {
		console.log("use Effect");
		let resp = auth.onAuthStateChanged((user) => {
			console.log("Auto Login", user);
			setUser(user);
			setLoader(false);
		});
		return function () {
			resp();
		};
	}, []);

	const value = {
		login,
		signOut,
		signUp,
		currentUser,
	};
	return (
		<AuthContext.Provider value={value}>
			{!loader && children}
		</AuthContext.Provider>
	);
}
