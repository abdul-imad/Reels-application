import React from "react";

export default function ProgressBar({ progress, url }) {
	return (
		<div>
			<h1>{!url && progress}</h1>
		</div>
	);
}
