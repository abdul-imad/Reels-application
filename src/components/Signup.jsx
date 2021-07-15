import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { database, storage } from "../firebase";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loader, setLoader] = useState(false);
	const [err, setError] = useState(false);
	const [profileImg, setProfileImg] = useState(null);
	const history = useHistory();
	const { signUp, currentUser } = useContext(AuthContext);

	const handleImageUpload = (e) => {
		let file = e?.target?.files[0];
		if (file !== null) {
			setProfileImg(e.target.files[0]);
			// console.log(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoader(true);
			let res = await signUp(email, password);
			let uid = res.user.uid;
			let uploadPhotoEvent = storage
				.ref(`/users/${uid}/ProfilePic`)
				.put(profileImg);
			uploadPhotoEvent.on("state_changed", progress, error, success);

			function progress(snapshot) {
				let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(progress);
			}

			function error(err) {
				setLoader(false);
				setError(true);
				// console.log(err);
			}

			async function success() {
				let photoURL = await uploadPhotoEvent.snapshot.ref.getDownloadURL();
				database.users.doc(uid).set({
					userId: uid,
					username,
					email: email,
					postIds: [],
                    likedPosts:[],
					createdAt: database.getTimeStamp(),
					profileUrl: photoURL,
				});
				setTimeout(() => {
					setLoader(false);
					history.push("/");
				}, 2000);
				// console.log(photoURL);
			}
		} catch (err) {
			setError(true);
			setLoader(false);
			console.log(err);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			if (currentUser) {
				history.push("/");
			}
		}, 2000);
	});

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">
						Username
						<input
							type="text"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="email">
						Email
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="password">
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="image">
						Profile Photo
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								handleImageUpload(e);
							}}
						/>
					</label>
				</div>
				<button type="submit" disabled={loader}>
					Signup
				</button>
			</form>
		</div>
	);
}
