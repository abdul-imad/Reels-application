import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Avatar } from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Likes from "./Likes";

export default function Reel({ post }) {
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const { currentUser } = useContext(AuthContext);

	const useStyles = makeStyles({
		profilePic: {
			width: "24px",
			height: "24px",
			marginRight: "5px",
			cursor: "pointer",
		},
		comment: {
			color: "#ddd",
			fontSize: "24px",
			marginLeft: "20px",
			cursor: "pointer",
		},
	});

	useEffect(() => {
		(async function fn() {
			let unsub = await database.users.doc(currentUser.uid).get();
			let userData = unsub.data();
			setUserData(userData);
			setLoading(false);
			return unsub;
		})();
	}, []);
	const classes = useStyles();
	return (
		<>
			{loading ? (
				<CircularProgress color="secondary" />
			) : (
				<>
					<video className="profile-videostyles" autoPlay loop muted={true}>
						<source src={post.reelURL} type="video/mp4" />
						ERROR
					</video>
					<div className="profile-post-info">
						<div className="uploader_info">
							<Avatar
								src={userData.profileUrl}
								alt="Profile-Pic"
								className={classes.profilePic}
							/>
							<p className="profile-userName">{userData.username}</p>
							<pre> •</pre>
						</div>
						<div className="actions">
							<Likes userData={userData} likedArr={post.likes} puid={post.id} />

							<ChatBubbleIcon className={classes.comment} />
						</div>
					</div>
				</>
			)}
		</>
	);
}
