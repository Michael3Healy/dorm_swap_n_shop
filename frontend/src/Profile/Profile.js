import { useContext } from 'react';
import UserContext from '../userContext';
import PostList from '../Posts/PostList';
import './Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
	const { currUser } = useContext(UserContext);

	return (
		<div className='Profile p-5 container'>
			<div className='container d-flex justify-content-center'>
				<div className='profile-card'>
					<div className='d-flex align-items-center'>
						<div className='image'>
							<img src='https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80' className='rounded' width='155' />
						</div>

						<div className='main w-100'>
							<h4 className='mb-0 mt-0'>{currUser.username}</h4>

							<div className='p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white stats'>
								<div className='d-flex flex-column m-2'>
									<span className='listings'>Listings</span>
									<span className='number1'>{currUser.posts.length}</span>
								</div>

								<div className='d-flex flex-column m-2'>
									<span className='rating'>Rating</span>
									<span className='number2'>{currUser.rating || 'None'}</span>
								</div>

								<div className='d-flex flex-column m-2'>
									<span className='num-ratings'>#Ratings</span>
									<span className='number3'>{currUser.numRatings}</span>
								</div>
							</div>
							<div className='personal p-3'>
								<h5>Contact</h5>
								<p>Phone Number: {currUser.phoneNumber}</p>
								<p>Email: {currUser.email}</p>
							</div>
							<div className='button mt-2 d-flex flex-row align-items-center'>
								<Link to={`/users/${currUser.username}/edit`} className='btn btn-sm btn-outline-primary' id='edit'>
									Edit
								</Link>
								<button className='btn btn-sm btn-danger' id='delete'>Delete</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<h2 className='text-center mt-5'>Posts</h2>
			<PostList username={currUser.username} />
		</div>
	);
};

export default Profile;
