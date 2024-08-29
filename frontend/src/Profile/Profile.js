import { useContext, useEffect, useState } from 'react';
import UserContext from '../userContext';
import PostList from '../Posts/PostList';
import './Profile.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ShopApi from '../api';
import StarRating from '../common/StarRating';
import LoadingScreen from '../LoadingScreen';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const Profile = () => {
	const { currUser } = useContext(UserContext);
	const { username } = useParams();
	const [userProfile, setUserProfile] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData = await ShopApi.getUser(username);
				setUserProfile(userData);
			} catch (err) {
				setError(err.response?.data?.error?.message || err.message || 'User not found');
				navigate('/404');
			} finally {
				setIsLoading(false);
			}
		};
		if (username !== currUser.username) {
			// Fetch user data
			fetchUserData();
		} else {
			// Set user data to current user
			setUserProfile(currUser);
		}
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username, currUser]);

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='Profile p-5 container'>
			{error && <div className='alert alert-danger'>{error}</div>}
			<div className='container d-flex justify-content-center'>
				<div className='profile-card container'>
					<div className='row'>
						<div className='col-12'>
							<div className='image'>
								<img src={userProfile.profilePicture ? `${BASE_URL}/${userProfile.profilePicture}` : `${BASE_URL}/uploads/default-pic.png`} className='rounded' width={250} alt='...' />
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-12'>
							<h2>{userProfile.username}</h2>

							<div className='rounded text-white stats d-flex justify-content-center'>
								<div className='d-flex flex-column m-2'>
									<span className='listings'>Listings</span>
									<span className='number1'>{userProfile.posts?.length}</span>
								</div>

								<div className='justify-content-center m-2'>
									<span className='ratings'>Rating</span>
									<div className='d-flex fs-3 justify-content-center'>
										<StarRating rating={userProfile.rating || 0} />
										<span className='num-ratings'>({userProfile.numRatings})</span>
									</div>
								</div>
							</div>
							<div className='personal p-2'>
								<h5>Contact</h5>
								<p>Phone Number: {userProfile.phoneNumber}</p>
								<p>Email: {userProfile.email}</p>
							</div>
							{username === currUser.username && (
								<div className='button-container'>
									<Link to={`/users/${currUser.username}/edit`} className='btn btn-sm btn-primary p-2' id='edit' data-testid='edit-link'>
										Edit
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<h2 className='text-center mt-5'>Posts</h2>
			<PostList username={userProfile.username || username || currUser.username} />
		</div>
	);
};

export default Profile;
