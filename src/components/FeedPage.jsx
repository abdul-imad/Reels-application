import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import Navbar from "./Navbar";
import UploadBtn from "./UploadBtn";
import VideoFeed from "./VideoFeed";

export default function Feed() {
	const [userData, setUserData] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		const ac = new AbortController();
		(async function fetchUser() {
			let currUserData = await database.users.doc(currentUser.uid).get();
			setUserData(currUserData.data());
			setPageLoading(false);
		})();
		return () => {
			ac.abort();
		};
	}, [currentUser.uid]);

	return (
		<div>
			{pageLoading ? (
				<div>Loading....</div>
			) : (
				<>
					{userData.profileUrl && <Navbar userData={userData} />}
					<UploadBtn userData={userData} />
					<VideoFeed />
				</>
			)}
		</div>
	);
}
