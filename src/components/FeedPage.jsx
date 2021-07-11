import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import Navbar from "./Navbar";
import UploadBtn from "./UploadBtn";
import VideoFeed from "./VideoFeed";

export default function Feed() {
	const [user, setUser] = useState();
	const [pageLoading, setPageLoading] = useState(true);

	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		const fetchUser = async () => {
			let currUserData = await database.users.doc(currentUser.uid).get();
			setUser(currUserData.data());
			setPageLoading(false);
		};
		fetchUser();
	}, []);

	return (
		<div>
			{pageLoading ? (
				<div>Loading....</div>
			) : (
				<>
					<Navbar user={user} />
					<UploadBtn />
					<VideoFeed />
				</>
			)}
		</div>
	);
}
