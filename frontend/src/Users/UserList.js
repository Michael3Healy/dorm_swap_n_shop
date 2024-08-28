import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
import UserCard from './UserCard';
import './UserList.css';
import { useState, useEffect } from 'react';
import ShopApi from '../api';
import SearchBar from '../common/SearchBar';
import useFields from '../hooks/useFields';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchParams, handleChange, setSearchParams] = useFields({ username: '' });

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const updatedSearchParams = {};
		for (let [key, value] of params) {
			updatedSearchParams[key] = value;
		}
		setSearchParams(updatedSearchParams);
		const getUsers = async () => {
			try {
				const users = await ShopApi.getUsers(updatedSearchParams); // each user is { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }
				setUsers(users);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};
		getUsers();
	}, [location.search]);

	const handleSubmit = async e => {
		e.preventDefault();
		const search = new URLSearchParams(searchParams).toString();
		navigate(`?${search}`);
	};

	if (error) return <ErrorAlert error={error} />;

	// if (isLoading) return <LoadingScreen />; // Add back in if data gets large enough to warrant loading screen

	return (
		<div className='UserList'>
			<SearchBar names={['username']} values={[searchParams.username]} placeholders={['Username']} onChange={handleChange} handleSubmit={handleSubmit} />
			<div className='UserList-users container'>
				{users.map(u => (
					<UserCard
						key={u.username}
						username={u.username}
						profilePicture={u.profilePicture}
					/>
				))}
			</div>
		</div>
	);
};

export default UserList;
