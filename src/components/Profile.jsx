import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import Navbar from "./Navbar";
import Reel from "./Reel";

export default function Profile() {
	const [username, setUsername] = useState("");
	const [profileUrl, setProfileUrl] = useState();
	const [userData, setUserData] = useState();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { currentUser } = useContext(AuthContext);
	useEffect(() => {
		(async function () {
			let userRef = await database.users.doc(currentUser.uid).get();
			let userObj = userRef.data();
			setUserData(userObj);
			setUsername(userObj.username);
			setProfileUrl(userObj.profileUrl);
			let postsArrLength = userObj.postIds.length;
			let postsArr = [];
			for (let i = 0; i < 1; i++) {
				let postId = userObj.postIds[i];
				let postRef = await database.posts.doc(postId).get();
				let postObj = postRef.data();
				let reelURL = postObj.reelURL;
				postsArr.push({reelURL});

			}
			setPosts(postsArr);
			setLoading(true);
			return userRef;
		})();
	}, []);
	return (
		<div>
			{!loading ? (
				<h1>Loading</h1>
			) : (
				<>
					<Navbar userData={userData} />
					<div className="profile">
						<h1>{username}</h1>
						<img src={profileUrl} alt="" />
					</div>
					<div>
						{posts.map((post, idx) => {
							return (
								<div className="post-container" key={post.puid}>
									<Reel
										src={post.reelURL}
										userName={post.uploaderName}
										profilePic={post.avatar}
										id={post.reelURL}
									/>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
