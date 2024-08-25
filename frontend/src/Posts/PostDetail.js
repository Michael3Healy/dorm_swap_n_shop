import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import './PostDetail.css';
import Modal from '../common/Modal';
import { useContext } from 'react';
import UserContext from '../userContext';

const PostDetail = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [item, setItem] = useState(null);
	const [user, setUser] = useState(null);
	const [location, setLocation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const { currUser } = useContext(UserContext);
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const handleShow = () => setShowModal(true);
	const handleClose = () => setShowModal(false);

	const handlePurchase = async () => {
		try {
			const { id: transactionId } = await ShopApi.createTransaction(id, currUser.username, user.username, item.price);
			navigate(`/transactions/${transactionId}`);
		} catch (error) {
			setError(error);
		}
	};

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
								<button className='btn btn-success btn-lg mx-2' onClick={handleShow}>
									Purchase
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				show={showModal}
				handleClose={handleClose}
				title='Purchase Confirmation'
				body={
					<>
						<p>
							Are you sure you want to purchase <strong>"{item.title}"</strong> for <strong>${item.price}</strong>?
						</p>
						<label htmlFor='paymentMethod' className='form-label'>
							<strong>Select Payment Method</strong>
						</label>
						<select className='form-select mt-3' id='paymentMethod'>
							<option value='cash'>Cash</option>
							<option value='venmo' disabled>Venmo (not yet supported)</option>
						</select>
					</>
				}
				buttons={
					<>
						<button type='button' className='btn btn-outline-danger' onClick={handleClose}>
							Cancel
						</button>
						<button type='button' className='btn btn-success' onClick={handlePurchase}>
							Confirm
						</button>
					</>
				}
			/>
		</div>
	);
};

export default PostDetail;
