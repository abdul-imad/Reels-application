import React, { useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useEffect } from "react";
import { database } from "../firebase";

export default function Likes(props) {
	const [isLiked, setIsLiked] = useState(null);
	const [loading, setLoading] = useState(true);
	console.log("like");
	const useStyles = makeStyles({
		liked: {
			fontSize: "24px",
			color: "red",
			marginLeft: "10px",
			cursor: "pointer",
		},
		notLiked: {
			fontSize: "24px",
			color: "#ddd",
			marginLeft: "10px",
			cursor: "pointer",
		},
	});

	//function for handling likes
	const handlePostLiked = async () => {
		if (isLiked) {
			let updatedLikedArr = props.likedArr.filter((el) => {
				return el !== props.userData.userId;
			});
			database.posts
				.doc(props.puid)
				.update({
					likes: updatedLikedArr,
				})
				.then(() => {})
				.catch(() => {});
		} else {
			let updatedLikedArr = [...props.likedArr, props.userData.userId];
			database.posts
				.doc(props.puid)
				.update({
					likes: updatedLikedArr,
				})
				.then(() => {})
				.catch(() => {});
		}
	};

	//check if posts are liked on page load
	useEffect(() => {
		let check = props.likedArr.includes(props.userData.userId) ? true : false;
		setIsLiked(check);
		setLoading(false);
	}, [props.likedArr]);
	const classes = useStyles();

	return (
		<>
			{loading ? (
				<CircularProgress color="secondary" />
			) : (
				<FavoriteIcon
					className={isLiked ? classes.liked : classes.notLiked}
					onClick={handlePostLiked}
				/>
			)}
		</>
	);
}
