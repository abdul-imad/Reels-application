import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { database, storage } from "../firebase";

export default function Signup(props) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loader, setLoader] = useState(false);
	const [err, setError] = useState(false);
	const [profileImg, setProfileImg] = useState(null);
	const { signUp } = useContext(AuthContext);

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
					createdAt: database.getTimeStamp(),
					profileUrl: photoURL,
                    postIds:[]
				});
				setLoader(false);
				props.history.push("/");
				// console.log(photoURL);
			}
		} catch (err) {
			setError(true);
			setLoader(false);
			console.log(err);
		}
	};
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
