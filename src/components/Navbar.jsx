import React, { useState, useContext } from "react";
import { Avatar } from "@material-ui/core";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../images/instagram.png";
import { makeStyles } from "@material-ui/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ExploreRoundedIcon from "@material-ui/icons/ExploreRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

export default function Navbar(props) {
	const [loader, setLoader] = useState(false);
	let { signOut } = useContext(AuthContext);

	const useStyles = makeStyles({
		icons: {
			fontSize: "28px",
			margin: "5px",
			cursor: "pointer",
		},
		avatar: {
			width: "32px",
			height: "32px",
			cursor: "pointer",
			margin: "5px",
		},
	});

	const logout = async () => {
		setLoader(true);
		await signOut();
		setLoader(false);
	};

	const classes = useStyles();
	return (
		<div className="navbar">
			<div className="logo">
				<img src={logo} alt="" />
			</div>
			<div className="navbar-icons">
				<HomeRoundedIcon titleAccess="home" className={classes.icons} />
				<ExploreRoundedIcon titleAccess="" className={classes.icons} />
				<Avatar
					src={props.userData.profileUrl}
					titleAccess="Profile"
					alt="Profile-Pic"
					className={(classes.icons, classes.avatar)}
				/>
				<ExitToAppRoundedIcon
					titleAccess="Logout"
					onClick={logout}
					className={classes.icons}
					disabled={loader}
				>
					Logout
				</ExitToAppRoundedIcon>
			</div>
		</div>
	);
}
