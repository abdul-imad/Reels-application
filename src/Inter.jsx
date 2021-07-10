import React, { useEffect } from "react";
// variable resource get
import v1 from "./videos/bike-ride.mp4";
import v2 from "./videos/child-basketball.mp4";
import v3 from "./videos/highway.mp4";
import v4 from "./videos/mountain-road.mp4";
import v5 from "./videos/seashore.mp4";
import "./inter.css";
import { element } from "prop-types";
export default function Inter() {
	function callBack(entries) {
		console.log(entries);
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
			threshold: 0.7,
		};
		const observer = new IntersectionObserver(callBack, conditionObj);
		let elements = document.querySelectorAll(".video-container");
		elements.forEach((element) => {
			observer.observe(element);
		});
	}, []);

	return (
		<div>
			<div className="video-container">
				<Video src={v1} id="a"></Video>
			</div>
			<div className="video-container">
				<Video src={v2} id="b"></Video>
			</div>
			<div className="video-container">
				<Video src={v3} id="c"></Video>
			</div>
			<div className="video-container">
				<Video src={v4} id="d"></Video>
			</div>
			<div className="video-container">
				<Video src={v5} id="e"></Video>
			</div>
		</div>
	);
}

function Video(props) {
	return (
		<video className="video-styles" loop muted="true" id={props.id}>
			<source src={props.src} type="video/mp4"></source>
		</video>
	);
}
