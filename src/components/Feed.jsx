import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Feed() {
    const [loader, setLoader]=useState(false);
	let { signOut } = useContext(AuthContext);
	const logout = async () => {
        setLoader(true);
		await signOut();
        setLoader(false);
	};
    console.log("Feed logout");
	return (
		<div>
			Feed
			<button onClick={logout} disabled={loader}>Logout</button>
		</div>
	);
}
