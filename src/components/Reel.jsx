import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import { makeStyles } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Likes from "./Likes";

export default function Reel(props) {
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const { currentUser } = useContext(AuthContext);

	const useStyles = makeStyles({
		profilePic: {
			width: "30px",
			height: "30px",
			border: "1px solid #E1306C",
			marginRight: "10px",
			cursor: "pointer",
		},
		comment: {
			color: "#ddd",
			fontSize: "24px",
			marginLeft: "1rem",
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

	// Intersection Observer
	async function callBack(entries) {
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
		let elements = document.querySelectorAll(".post-container");
		elements.forEach((element) => {
			observer.observe(element);
		});
	}, []);

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
			{
				<>
					<video
						onEnded={handleAutoScroll}
						className="videostyles"
						autoPlay
						muted={true}
						id={props.id}
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
							{!loading && (
								<Likes
									userData={userData}
									likedArr={props.likedArr}
									puid={props.puid}
								/>
							)}
							<ChatBubbleIcon className={classes.comment} />
						</div>
					</div>
				</>
			}
		</>
	);
}
