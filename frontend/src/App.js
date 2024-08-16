import RoutesList from './RoutesList';
import NavBar from './NavBar';
import { useState, useEffect } from 'react';
import UserContext from './userContext';
import ErrorAlert from './ErrorAlert';
import { jwtDecode } from 'jwt-decode';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
	const [currUser, setCurrUser] = useLocalStorage('currUser', {});
  const [error, setError] = useState(null);

	return (
		// UserContext.Provider is used to provide the current user and the setCurrUser function to all child components.
		<UserContext.Provider value={{ currUser, setCurrUser }}>
			<div className='App'>
				<NavBar />
				<main className='App-main'>
					{error && <ErrorAlert />}
					<RoutesList />
				</main>
			</div>
		</UserContext.Provider>
	);
}

export default App;
