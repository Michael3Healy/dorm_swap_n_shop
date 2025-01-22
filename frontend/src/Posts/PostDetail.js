import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import './PostDetail.css';
import Modal from '../common/Modal';
import { useContext } from 'react';
import UserContext from '../userContext';
import Map from '../Map/Map';
import StarRating from '../common/StarRating';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

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

	const handleDelete = async () => {
		try {
			await ShopApi.deletePost(id);
			navigate('/');
		} catch (error) {
			setError(error);
		}
	};

	const handlePurchase = async () => {
		try {
			const { id: transactionId } = await ShopApi.createTransaction(id, currUser.username, user.username, item.price);
			await ShopApi.markItemSold(item.id);
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
				if (!postData) navigate('/404');
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='PostDetail'>
			{error && <ErrorAlert error={error} />}
			<div className='container'>
				<div className='row'>
					<div className='col'>
						<div className='image-container'>
							<img src={`${BASE_URL}/${item.image}` || `${BASE_URL}/default-image.png`} className='img-fluid img' alt='...' />
							<div className='price-tag'>
								<span className='currency'>$</span>
								<span className='amount'>{item?.price}</span>
							</div>
						</div>
					</div>
					<div className='col info-container text-start'>
						<h1 className='my-0 title'>{item?.title}</h1>
						<p className='badge text-bg-info'>{item?.category}</p>
						<h2 className='seller mt-3 mb-0'><Link className='PostDetail-cardLink' to={`/users/${user?.username}`}>{user?.username}</Link></h2>
						<div className='rating-container d-flex'>
							<StarRating rating={user?.rating || 0} />
							<span className='num-ratings'>({user?.numRatings})</span>
						</div>
						<p className='mt-3 description'>"{item?.description}"</p>
						<div className='col-12 map-container'>
							<Map locationId={post?.locationId} size='200x200'/>
							<div className='location'>
								<p className='m-0'>Pickup At: </p>
								<p className=''>{location?.street}, {location?.city} {location?.state}</p>
							</div>
						</div>
						{currUser.username !== user?.username ? (
							<button className='btn btn-success decision-btn' onClick={handleShow}>
								Purchase
							</button>
						) : (
							<button className='btn btn-danger decision-btn' onClick={handleDelete}>
								Delete
							</button>
						)}
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
							Are you sure you want to purchase <strong>"{item?.title}"</strong> for <strong>${item?.price}</strong>?
						</p>
						<label htmlFor='paymentMethod' className='form-label'>
							<strong>Select Payment Method</strong>
						</label>
						<select className='form-select mt-3' id='paymentMethod'>
							<option value='cash'>Cash</option>
							<option value='venmo' disabled>
								Venmo (not yet supported)
							</option>
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
