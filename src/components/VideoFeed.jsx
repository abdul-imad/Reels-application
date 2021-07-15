import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase";
import uuid from "react-uuid";
import { makeStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function Feed(props) {
	const [allPosts, setAllPosts] = useState([]);
	const [isLiked, setIsLiked] = useState(false);

	const useStyles = makeStyles({
		liked: {
			fontSize: "48px",
			color: "red",
		},
		notLiked: {
			fontSize: "48px",
			color: "#ddd",
		},
	});

	// post like function
	const handlePostLiked = async (puid) => {
		const currPostRef = await database.posts.doc(puid).get();
		const postObj = currPostRef.data();
		const likes = postObj.likes;
		if (isLiked === false) {
			database.posts.doc(puid).update({
				likes: [...likes, props.currentUser.uid],
			});
		} else {
			const updatedLikes = likes.filter((uid) => {
				return uid !== props.currentUser.uid;
			});
			database.posts.doc(puid).update({
				likes: updatedLikes,
			});
		}
		setIsLiked(!isLiked);
	};

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
						console.log("USEEFFECT!!");
						let uid = allPostsData[i].uid;
						let puid = snapshot.docs[i].id;
						let userData = await database.users.doc(uid).get();
						let uploaderName = userData.data().username;
						console.log(uploaderName);
						let avatar = userData.data().profileUrl;
						postsArr.push({ reelURL, uploaderName, avatar, puid });
					}
					setAllPosts(postsArr);
				});
			return unsub;
		})();
	}, []);

	const classes = useStyles();

	// Displaying videos on UI
	return allPosts.map((post) => {
		return (
			<div className="post-container" key={uuid()}>
				<Video src={post.reelURL} userName={post.uploaderName} />
				<FavoriteIcon
					className={isLiked ? classes.liked : classes.notLiked}
					onClick={() => {
						handlePostLiked(post.puid);
					}}
				/>
				{/* <Like currentUser={props.currentUser} puid ={post.puid} /> */}
			</div>
		);
	});
}

const Video = (props) => {
	return (
		<>
			<video className="videostyles" autoPlay loop muted={true} id={props.id}>
				<source src={props.src} type="video/mp4"></source>
			</video>
		</>
	);
};
