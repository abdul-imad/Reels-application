import React,{useState,useContext} from 'react';
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
    const [loader, setLoader]=useState(false);
	let { signOut } = useContext(AuthContext);
	const logout = async () => {
        setLoader(true);
		await signOut();
        setLoader(false);
	};
    return (
        <div>
            <button onClick={logout} disabled={loader}>Logout</button>
        </div>
    )
}
