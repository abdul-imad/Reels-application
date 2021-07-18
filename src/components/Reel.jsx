import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import { makeStyles } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
let postIds;

export default function Reel(props) {
	const [isLiked, setIsLiked] = useState(false);
	const { currentUser } = useContext(AuthContext);
	console.log(currentUser.uid);

	const useStyles = makeStyles({
		liked: {
			fontSize: "32px",
			color: "red",
		},
		notLiked: {
			fontSize: "32px",
			color: "#ddd",
			marginLeft: "10px",
			cursor: "pointer",
		},
		profilePic: {
			marginRight: "10px",
			cursor: "pointer",
		},
		comment: {
			color: "#ddd",
			fontSize: "32px",
			marginLeft: "20px",
			cursor: "pointer",
		},
	});

	// video auto scroll on completion
	const handleAutoScroll = (e) => {
		let next = ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
		if (next) {
			next.scrollIntoView({ behavior: "smooth" });
			e.target.muted = true;
		}
	};

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

	function callBack(entries) {
		console.log(entries);
		entries.forEach((entry) => {
			let child = entry.target.children[0];
			child.play().then(function () {
				if (entry.isIntersecting === false) {
					child.pause();
				}
			});
		});
	}
	useEffect(() => {
		let conditionObj = {
			root: null,
			threshold: 0.8,
		};
		const observer = new IntersectionObserver(callBack, conditionObj);
		console.log(observer);
		let elements = document.querySelectorAll(".post-container");
		elements.forEach((element) => {
			observer.observe(element);
		});
	}, []);
	useEffect(() => {
		postIds = document.getElementById(`${props.id}`).parentNode.id;
	}, []);

	useEffect(() => {
		(async function fn() {
			let unsub = await database.users.doc(currentUser.uid).get();
			let userData = unsub.data();
			let likedPosts = userData.likedPosts;
			let postIsLiked;
			if (likedPosts.length > 0) {
				postIsLiked = likedPosts.filter((puid) => {
					return puid === postIds;
				});
				if (postIsLiked.length !== 0) {
					setIsLiked(true);
				} else {
					setIsLiked(false);
				}
			} else {
				setIsLiked(false);
			}
			return unsub;
		})();
	}, []);
	const classes = useStyles();
	return (
		<>
			<video
				onEnded={handleAutoScroll}
				className="videostyles"
				autoPlay
				muted={true}
				id={props.id}
				puid={postIds}
			>
				<source src={props.src} type="video/mp4" />
				ERROR
			</video>
			<div className="post-info">
				<div className="uploader_info">
					<Avatar
						src={props.profilePic}
						alt="Profile-Pic"
						className={classes.profilePic}
					/>
					<p className="userName">{props.userName}</p>
					<pre> •</pre>
				</div>
				<div className="actions">
					<FavoriteIcon
						className={isLiked ? classes.liked : classes.notLiked}
						onClick={() => {
							handlePostLiked(postIds);
						}}
					/>
					<ChatBubbleIcon className={classes.comment} />
				</div>
			</div>
		</>
	);
}
