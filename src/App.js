import { useContext } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import login from "./components/Login";
import signup from "./components/Signup";
import Profile from "./components/Profile";
import feed from "./components/Feed";
import Inter from "./Inter.jsx";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
export default function App() {
	// console.log("App")
	return (
		// <BrowserRouter>
		// 	<AuthProvider>
		// 		<Switch>
		// 			<Route path="/login" component={login}></Route>
		// 			<Route path="/signup" component={signup}></Route>
		// 			<PrivateRoute path="/profile" abc={Profile}></PrivateRoute>
		// 			<PrivateRoute path="/" exact abc={feed}></PrivateRoute>
		// 		</Switch>
		// 	</AuthProvider>
		// </BrowserRouter>
		<Inter />
	);
}
function PrivateRoute(parentProps) {
	let { currentUser } = useContext(AuthContext);
	console.log(currentUser);
	const Component = parentProps.abc;
	return (
		<Route
			{...parentProps}
			render={(parentProps) => {
				return currentUser != null ? (
					<Component {...parentProps}></Component>
				) : (
					<Redirect to="/login"></Redirect>
				);
			}}
		></Route>
	);
}
