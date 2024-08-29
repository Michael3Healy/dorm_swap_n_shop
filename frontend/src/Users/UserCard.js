import './UserCard.css';
import { Link } from 'react-router-dom';
import ShopApi from '../api';
import { useState, useEffect } from 'react';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const UserCard = ({ username, profilePicture }) => {
	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, rating, numRatings, posts, transactions }
				const userData = await ShopApi.getUser(username);
				setUser(userData);
				setIsLoading(false);
			} catch (error) {
				setError(error);
			}
		};
		fetchUserData();
	}, [username]);

	if (error) return <ErrorAlert error={error} />;

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='UserCard container d-flex justify-content-center align-items-center'>
			<div className='card'>
				<div className='img-container'>
					<img src={`${BASE_URL}/${user.profilePicture}`} className='img-fluid profile-pic' alt='testUser'/>
				</div>
				<div className='mt-0 text-center'>
					<div className='profile-bg'>
						<h3 className='mb-0 username'>{username}</h3>
					</div>

					<Link to={`/users/${username}`}><button className='btn btn-primary btn-sm follow mt-4 mx-3'>View Profile</button></Link>

					<div className='d-flex justify-content-between align-items-center mt-3 px-4'>
						<div className='stats'>
							<h6 className='mb-0'>Current Listings</h6>
							<span>{user.posts.length}</span>
						</div>

						<div className='stats'>
							<h6 className='mb-0'>Rating</h6>
							<span>{user.rating || 'None'}</span>
						</div>

						<div className='stats'>
							<h6 className='mb-0'>#Ratings</h6>
							<span>{user.numRatings}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
