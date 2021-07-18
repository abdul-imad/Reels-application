import React from "react";

export default function ProgressBar({ progress, url }) {
	return (
		<div>
			{!url && (
				<div className="progress-bar" style={{ width: progress + "%" }}></div>
			)}
		</div>
	);
}
