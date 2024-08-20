import RoutesList from './RoutesList';
import NavBar from './NavBar';
import { useState, useEffect } from 'react';
import UserContext from './userContext';
import ErrorAlert from './ErrorAlert';
import { jwtDecode } from 'jwt-decode';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';
import ShopApi from './api';

function App() {
	// Token initialized to the token stored in local storage, or an empty string if no token is found.
	const [token, setToken] = useLocalStorage('token', '');

	const [currUser, setCurrUser] = useLocalStorage('currUser', {});
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { username } = jwtDecode(token);
				// each user is { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, rating, numRatings, posts, transactions }
				const user = await ShopApi.getUser(username);
				setCurrUser(user);
			} catch (err) {
				setCurrUser({});
			}
		};

		if (token) {
			ShopApi.token = token;
			fetchUser();
		}
		// eslint to ignore the warning about the dependency array not including setCurrUser. Including it would cause an infinite loop.
		// eslint-disable-next-line
	}, [token]);

	// Logs in the user with the given username and password.
	const login = async ({ username, password }) => {
		try {
			const newToken = await ShopApi.login(username, password);
			setToken(newToken);
			ShopApi.token = newToken;
			setError(null);
		} catch (err) {
			setError(err);
		}
	};

	// Registers the user with the given user data.
	const register = async userData => {
		try {
			const newToken = await ShopApi.register(userData);
			setToken(newToken);
			ShopApi.token = newToken;
			setError(null);
		} catch (err) {
			setError(err);
		}
	};

	// Logs out the current user.
	const logout = () => {
		setCurrUser({});
		setToken('');
		ShopApi.token = '';
	};

	return (
		// UserContext.Provider is used to provide the current user and the setCurrUser function to all child components.
		<UserContext.Provider value={{ currUser, setCurrUser }}>
			<div className='App'>
				<NavBar logout={logout} />
				<main className='App-main'>
					{error && <ErrorAlert message={error} />}
					<RoutesList login={login} register={register} />
				</main>
			</div>
		</UserContext.Provider>
	);
}

export default App;
