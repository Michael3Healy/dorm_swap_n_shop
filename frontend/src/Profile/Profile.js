import { useContext, useEffect, useState } from 'react';
import UserContext from '../userContext';
import PostList from '../Posts/PostList';
import './Profile.css';
import { Link, useParams } from 'react-router-dom';
import ShopApi from '../api';
const BASE_URL = process.env.REACT_APP_BASE_URL

const Profile = () => {
	const { currUser } = useContext(UserContext);
	const { username } = useParams();
	const [userProfile, setUserProfile] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await ShopApi.getUser(username);
			setUserProfile(userData);
		};
		if (username !== currUser.username) {
			// Fetch user data
			fetchUserData();
		} else {
			// Set user data to current user
			setUserProfile(currUser);
		}
	}, [username, currUser]);



	return (
		<div className='Profile p-5 container'>
			<div className='container d-flex justify-content-center'>
				<div className='profile-card'>
					<div className='d-flex align-items-center'>
						<div className='image'>
							<img src={`${BASE_URL}/${userProfile.profilePicture}`} className='rounded' width='155' />
						</div>

						<div className='main w-100'>
							<h4 className='mb-0 mt-0'>{userProfile.username}</h4>

							<div className='p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white stats'>
								<div className='d-flex flex-column m-2'>
									<span className='listings'>Listings</span>
									<span className='number1'>{userProfile.posts?.length}</span>
								</div>

								<div className='d-flex flex-column m-2'>
									<span className='rating'>Rating</span>
									<span className='number2'>{userProfile.rating || 'None'}</span>
								</div>

								<div className='d-flex flex-column m-2'>
									<span className='num-ratings'>#Ratings</span>
									<span className='number3'>{userProfile.numRatings}</span>
								</div>
							</div>
							<div className='personal p-3'>
								<h5>Contact</h5>
								<p>Phone Number: {userProfile.phoneNumber}</p>
								<p>Email: {userProfile.email}</p>
							</div>
							{username === currUser.username && (
								<div className='button mt-2 d-flex flex-row align-items-center'>
									<Link to={`/users/${currUser.username}/edit`} className='btn btn-sm btn-outline-primary' id='edit'>
										Edit
									</Link>
									<button className='btn btn-sm btn-danger' id='delete'>
										Delete
									</button>
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
