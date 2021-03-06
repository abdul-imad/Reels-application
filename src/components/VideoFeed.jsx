import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase";
import Reel from "./Reel";

export default function Feed() {
	const [allPosts, setAllPosts] = useState([]);

	// Bringing all videos from firebase on load
	useEffect(() => {
		(async function fetchPosts() {
			let unsub = await database.posts
				.orderBy("UploadTime", "desc")
				.onSnapshot(async (snapshot) => {
					let allPostsData = snapshot.docs.map((doc) => doc.data());

					let postsArr = [];

					for (let i = 0; i < allPostsData.length; i++) {
						let reelURL = allPostsData[i].reelURL;
						let likes = allPostsData[i].likes;
						let uid = allPostsData[i].uid;
						let puid = snapshot.docs[i].id;
						let userData = await database.users.doc(uid).get();
						let uploaderName = userData.data().username;
						let avatar = userData.data().profileUrl;
						postsArr.push({ reelURL, uploaderName, avatar, puid, likes });
					}
					setAllPosts(postsArr);
				});
			return unsub;
		})();
	}, []);

	// Displaying videos on UI
	return allPosts.map((post) => {
		return (
			<div className="post-container" key={post.puid}>
				<Reel
					likedArr={post.likes}
					src={post.reelURL}
					userName={post.uploaderName}
					profilePic={post.avatar}
					puid={post.puid}
				/>
			</div>
		);
	});
}
