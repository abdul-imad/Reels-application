import React,{useState,useContext} from 'react';
import { Avatar } from '@material-ui/core';
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar({user}) {
    const [loader, setLoader]=useState(false);
	let { signOut } = useContext(AuthContext);
    
	const logout = async () => {
        setLoader(true);
		await signOut();
        setLoader(false);
	};
    return (
        <div>
            <Avatar src={user.profileUrl} alt="Profile-Pic" />
            <button onClick={logout} disabled={loader}>Logout</button>
        </div>
    )
}
