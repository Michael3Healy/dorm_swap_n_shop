import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
import UserCard from './UserCard';
import './UserList.css';
import { useState, useEffect } from 'react';
import ShopApi from '../api';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getUsers = async () => {
			try {
				const users = await ShopApi.getUsers(); // each user is { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }
				setUsers(users);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};
		getUsers();
	}, []);

	if (error) return <ErrorAlert error={error} />;

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='UserList container'>
			{users.map(u => (
				<UserCard key={u.username} username={u.username} firstName={u.firstName} lastName={u.lastName} phoneNumber={u.phoneNumber} email={u.email} isAdmin={u.isAdmin} profilePicture={u.profilePicture} />
			))}
		</div>
	);
};

export default UserList;
