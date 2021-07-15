import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import { makeStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
let postIds;

export default function Reel(props) {
	const [allPosts, setAllPosts] = useState([]);
	const [isLiked, setIsLiked] = useState(false);
	// const [postIds, setPostIds] = useState([]);
	const { currentUser } = useContext(AuthContext);
	console.log(currentUser.uid);

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
		console.log(puid);
		const currPostRef = await database.posts.doc(puid).get();
		const postObj = currPostRef.data();
		console.log(postObj);
		const likes = postObj.likes;
		const currUserRef = await database.users.doc(currentUser.uid).get();
		const userObj = currUserRef.data();
		const likedPosts = userObj.likedPosts;
		console.log(likedPosts);
		if (isLiked === false) {
			database.posts.doc(puid).update({
				likes: [...likes, currentUser.uid],
			});
			database.users.doc(currentUser.uid).update({
				likedPosts: [...likedPosts, postIds],
			});
			setIsLiked(true);
		} else {
			const updatedLikes = likes.filter((uid) => {
				return uid !== currentUser.uid;
			});
			database.posts.doc(puid).update({
				likes: updatedLikes,
			});

			const updatedUserLikes = likedPosts.filter((puid) => {
				return puid !== postIds;
			});
			database.users.doc(currentUser.uid).update({
				likedPosts: updatedUserLikes,
			});
			setIsLiked(false);
		}
	};
	useEffect(() => {
		postIds = document.getElementById(`${props.id}`).parentNode.id;
	}, []);

	useEffect(() => {
		(async function fn() {
			let unsub = await database.users.doc(currentUser.uid).get();
			let userData = unsub.data();
			let likedPosts = userData.likedPosts;
			console.log(likedPosts.length);
			let postIsLiked;
			if (likedPosts.length > 0) {
				postIsLiked = likedPosts.filter((puid) => {
					return puid === postIds;
				});
				console.log(postIds);
				console.log(postIsLiked);
				if (postIsLiked.length !== 0) {
					setIsLiked(true);
				} else {
					setIsLiked(false);
				}
			} else {
				setIsLiked(false);
			}
			console.log(props.src);
			return unsub;
		})();
	}, []);
	const classes = useStyles();
	return (
		<>
			<video
				className="videostyles"
				autoPlay
				muted={true}
				id={props.id}
				puid={postIds}
			>
				<source src={props.src} type="video/mp4" />
				ERROR
			</video>
			<FavoriteIcon
				className={isLiked ? classes.liked : classes.notLiked}
				onClick={() => {
					handlePostLiked(postIds);
				}}
			/>
		</>
	);
}
