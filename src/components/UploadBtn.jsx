import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useHistory } from "react-router";
import { storage, database } from "../firebase";
import { Button } from "@material-ui/core";
import uuid from "react-uuid";

export default function UploadBtn() {
	const [loader, setLoader] = useState(false);
	const [error, setError] = useState(false);
	const [reel, setReel] = useState();
	const { currentUser } = useContext(AuthContext);

	const handleFileUpload = async (e) => {
		e.preventDefault();
		let isFile = e?.target?.files[0];
		if (isFile !== null) {
			setReel(e.target.files[0]);
			console.log(isFile);
			try {
				setLoader(true);
				let uploadPhotoEvent = storage.ref(`/posts/${uuid()}`).put(reel);
				uploadPhotoEvent.on("state_changed", progress, error, success);

				function progress(snapshot) {
					let progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(progress);
				}

				function error(err) {
					setLoader(false);
					setError(true);
					// console.log(err);
				}

				async function success() {
					let reelURL = await uploadPhotoEvent.snapshot.ref.getDownloadURL();
					let postObj = await database.posts.add({
						likes: [],
						comments: [],
						reelURL,
						uid: currentUser.uid,
						UploadTime: database.getTimeStamp(),
					});
					await database.users.doc(currentUser.uid).update({
						postIds: [...currentUser.postIds, postObj.id],
					});
					setLoader(false);
					// console.log(photoURL);
				}
			} catch (err) {
				setError(true);
				setLoader(false);
				// console.log(err);
			}
		}
	};
	return (
		<div>
			<input
				type="file"
				accept="video/*"
				id="video-upload-btn"
				style={{ display: "none" }}
				multiple
				onChange={handleFileUpload}
			/>
			<label htmlFor="video-upload-btn">
				<Button
					variant="contained"
					color="secondary"
					component="span"
					disabled={loader}
				>
					Upload
				</Button>
			</label>
		</div>
	);
}
