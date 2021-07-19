import React, { useState, useContext } from "react";
import { Avatar } from "@material-ui/core";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../images/instagram.png";
import { makeStyles } from "@material-ui/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ExploreRoundedIcon from "@material-ui/icons/ExploreRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { Link } from "react-router-dom";

export default function Navbar(props) {
	const [loader, setLoader] = useState(false);
	let { signOut } = useContext(AuthContext);

	const useStyles = makeStyles({
		icons: {
			fontSize: "28px",
			margin: "5px",
			cursor: "pointer",
            color:"black"
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
				<Link to="/">
					<HomeRoundedIcon titleAccess="home" className={classes.icons} />
				</Link>
				<ExploreRoundedIcon titleAccess="" className={classes.icons} />
				<Link to="/profile">
					<Avatar
						src={props.userData.profileUrl}
						titleAccess="Profile"
						alt="Profile-Pic"
						className={(classes.icons, classes.avatar)}
					/>
				</Link>
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
