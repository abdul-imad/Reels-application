import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database } from "../firebase";
import Navbar from "./Navbar";
import PostGrid from "./PostGrid";
import { Avatar, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	grid: {
		width: "70%",
		margin: "0 auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default function Profile() {
	const [userData, setUserData] = useState();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { currentUser } = useContext(AuthContext);
	const classes = useStyles();
	useEffect(() => {
		(async function () {
			let userRef = await database.users.doc(currentUser.uid).get();
			let userObj = userRef.data();
			setUserData(userObj);
			let postsArrLength = userObj.postIds.length;
			let postsArr = [];
			for (let i = 0; i < postsArrLength; i++) {
				let postId = userObj.postIds[i];
				console.log(postId);
				let postRef = await database.posts.doc(postId).get();
				let postObj = postRef.data();
				postsArr.push({ postObj, postsArrLength });
			}
			setPosts(postsArr);
			setLoading(true);
            console.log(userData.createdAt)
			return userRef;
		})();
	}, []);
	return (
		<div>
			{!loading ? (
				<CircularProgress color="secondary" />
			) : (
				<>
					<Navbar userData={userData} />
					<div className="account-header">
						<div className="profile-img">
							<Avatar src={userData.profileUrl} alt="Profile-Pic" />
						</div>
						<div className="account-info">
							<div className="name">
								<h2>{userData.username}</h2>
							</div>
							<div className="emial">
								<h5>{userData.email}</h5>
							</div>
							<div className="posts">
								<p>
									{userData.postIds.length}
									{userData.postIds.length === 1 ? (
										<span> Post</span>
									) : (
										<span> Posts</span>
									)}
								</p>
							</div>
							<div className="created-at">
                                <p>{userData.createdAt}</p>
                            </div>
						</div>
					</div>
					<div className={classes.root}>
						<Grid container spacing={1} className={classes.grid}>
							<Grid container item xs={12} md={12} spacing={3}>
								{posts.map((post, idx) => {
									return (
										<Grid item xs={4} className="post-card">
											<PostGrid className={classes.paper} post={post.postObj} />
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					</div>
				</>
			)}
		</div>
	);
}
