import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { storage, database } from "../firebase";
import { Button } from "@material-ui/core";
import uuid from "react-uuid";

export default function UploadBtn({ userData }) {
	const [loader, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { currentUser } = useContext(AuthContext);

	const handleFileUpload = async (e) => {
		e.preventDefault();
		let isFile = e?.target?.files[0];
		if (isFile !== null) {
			console.log(isFile);
			try {
				const uploadTask = storage.ref(`/posts/${uuid()}`).put(isFile);
				setLoading(true);
				const f1 = (snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(progress);
				};
				const f2 = () => {
					alert("There was an error in uploading the file");
					return;
				};
				const f3 = async () => {
					let reelURL = await uploadTask.snapshot.ref.getDownloadURL();
					let obj = {
						comments: [],
						likes: [],
						reelURL,
						uid: currentUser.uid,
						UploadTime: database.getTimeStamp(),
					};
					//   put the post object into post collection
					let postObj = await database.posts.add(obj);
					// 3. user postsId -> new post id put
					await database.users.doc(currentUser.uid).update({
						postIds: [...userData.postIds, postObj.id],
					});
					console.log(postObj.id);
					setLoading(false);
				};

				uploadTask.on("state_changed", f1, f2, f3);
			} catch (err) {
				setError(true);
				setLoading(false);
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
				disabled={loader}
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
