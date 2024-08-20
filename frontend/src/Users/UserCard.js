import './UserCard.css';
import { Link } from 'react-router-dom';
import ShopApi from '../api';
import { useState, useEffect } from 'react';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';

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
		<div class='UserCard container d-flex justify-content-center align-items-center'>
			<div class='card'>
				<div class='upper'>
					<img src='https://tinyurl.com/2a5vsg4a' class='img-fluid profile-pic' />
				</div>
				<div class='mt-5 text-center'>
					<div className='profile-bg'>
						<h3 class='mb-0 username'>{username}</h3>
					</div>

					<button class='btn btn-primary btn-sm follow mt-4 mx-3'>View Listings</button>
					<button class='btn btn-success btn-sm follow mt-4 mx-3'>Message</button>

					<div class='d-flex justify-content-between align-items-center mt-3 px-4'>
						<div class='stats'>
							<h6 class='mb-0'>Current Listings</h6>
							<span>{user.posts.length}</span>
						</div>

						<div class='stats'>
							<h6 class='mb-0'>Rating</h6>
							<span>{user.rating || 'None'}</span>
						</div>

						<div class='stats'>
							<h6 class='mb-0'>#Ratings</h6>
							<span>{user.numRatings}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
