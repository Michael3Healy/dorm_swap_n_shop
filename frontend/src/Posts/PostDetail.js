import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import './PostDetail.css';

const PostDetail = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [item, setItem] = useState(null);
	const [user, setUser] = useState(null);
	const [location, setLocation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Returns { id, posterUsername, itemId, locationId, postedAt }
				const postData = await ShopApi.getPost(id);
				setPost(postData);

				// Returns { id, image, category, title, price, isSold, description, ownerUsername }
				const itemData = await ShopApi.getItem(postData.itemId);
				setItem(itemData);

				// Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, rating, numRatings, posts }
				const userData = await ShopApi.getUser(postData.posterUsername);
				setUser(userData);

				// Returns { id, street, city, state, zip, latitude, longitude }
				const locationData = await ShopApi.getLocation(postData.locationId);
				setLocation(locationData);

				setError(null);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [id]);

	if (error) return <ErrorAlert error={error} />;

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='PostDetail'>
			<div className='container'>
				<div className='row'>
					<div className='col-6'>
						<div className='image-container'>
							<img src='https://tinyurl.com/2a5vsg4a' className='img-fluid img' />
							<div className='price-tag'>
								<span className='currency'>$</span>
								<span className='amount'>{item.price}</span>
							</div>
						</div>
					</div>

					<div className='col-6'>
						<h1 className='mt-5'>{item.title}</h1>
						<h2>Seller: {user.username}</h2>
						<h2>Pickup At: {location.street}</h2>
						<p>{item.description}</p>
						<div className='row mt-5'>
							<div className='col-12'>
								<button className='btn btn-lg btn-danger mx-2'>Ask Question</button>
								<button className='btn btn-lg btn-primary mx-2'>Save</button>
								<button className='btn btn-lg btn-info mx-2'>Message Seller</button>
								<button className='btn btn-success btn-lg mx-2'>Purchase</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetail;
