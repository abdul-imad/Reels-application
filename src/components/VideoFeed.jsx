import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase";

export default function Feed() {
	const [allPosts, setAllPosts] = useState([]);

	useEffect(() => {
		(async function fetchPosts() {
			let unsub = await database.posts
				.orderBy("UploadTime", "desc")
				.onSnapshot(async (snapshot) => {
					let allPostsData = snapshot.docs.map((doc) => doc.data());

					let postsArr = [];

					for (let i = 0; i < allPostsData.length; i++) {
						let reelURL = allPostsData[i].reelURL;
						let uid = allPostsData[i].uid;
						let userData = await database.users.doc(uid).get();
						let uploaderName = userData.data().username;
                        console.log(uploaderName)
						let avatar = userData.data().profileUrl;
						postsArr.push({ reelURL, uploaderName, avatar });
					}
					setAllPosts(postsArr);
				});
			return unsub;
		})();
	}, []);

	return allPosts.map((post, idx) => {
		return (
			<div className="post-container">
				<Video src={post.reelURL} id={idx} />
			</div>
		);
	});
}

const Video = (props) => {
	return (
		<video className="video-styles" autoPlay loop muted={true} id={props.id}>
			<source src={props.src} type="video/mp4"></source>
		</video>
	);
};
