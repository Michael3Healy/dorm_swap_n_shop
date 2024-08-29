import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShopApi from '../api';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
import './TransactionDetail.css';

const TransactionDetail = () => {
	const [transaction, setTransaction] = useState(null);
	const [item, setItem] = useState(null);
	const [error, setError] = useState(null);
	const [rating, setRating] = useState('');
	const [alreadyRated, setAlreadyRated] = useState(false);
	const { transactionId } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch transaction details
		const fetchTransaction = async () => {
			try {
				const transactionData = await ShopApi.getTransaction(transactionId);
				setTransaction(transactionData);

				const postData = await ShopApi.getPost(transactionData.postId);

				const itemData = await ShopApi.getItem(postData.itemId);
				setItem(itemData);

				// Check if already rated
				if (transactionData.rated) {
					setAlreadyRated(true);
				}
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTransaction();
	}, [transactionId]);

	const handleRatingChange = e => {
		setRating(e.target.value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			if (!rating) {
				throw new Error('Please enter a rating between 1 and 5');
			}
			const { buyerUsername, sellerUsername } = transaction;
			await ShopApi.rateUser(buyerUsername, sellerUsername, rating);
			await ShopApi.markTransactionAsRated(transactionId);
			setAlreadyRated(true);
		} catch (error) {
			setError(error);
		}
	};

	if (isLoading) return <LoadingScreen />;

	if (!transaction || !item)
		return (
			<div className='d-grid p-4'>
				<ErrorAlert error={error} />
			</div>
		);

	return (
		<div className='TransactionDetail container'>
			{error && <ErrorAlert error={error} />}
			<div className='transaction-detail'>
				<h1>Transaction #{transaction.id} Details</h1>
				<div className='transaction-info'>
					<p>
						<strong>Buyer:</strong> {transaction.buyerUsername}
					</p>
					<p>
						<strong>Seller:</strong> {transaction.sellerUsername}
					</p>
					<p>
						<strong>Item:</strong> {item.title}
					</p>
					<p>
						<strong>Price:</strong> ${transaction.price}
					</p>
					<p>
						<strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleDateString()}
					</p>
				</div>
				<div className='rating-section'>
					<h2>Rate the Seller</h2>
					{!alreadyRated && <p className='disclaimer'>Please wait until you have received the item to rate the seller.</p>}
					{alreadyRated ? (
						<p className='successful-rating'>You have already rated this transaction. Thank you!</p>
					) : (
						<form onSubmit={handleSubmit}>
							<div className='form-group'>
								<label htmlFor='rating' className='mx-2'>
									Rating (1-5):
								</label>
								<input type='number' id='rating' name='rating' min='1' max='5' value={rating} onChange={handleRatingChange} />
							</div>
							<div className='justify-content-center d-flex'>
								<button type='button' className='btn btn-secondary mx-3' onClick={() => navigate('/')}>
									Go Home
								</button>
								<button type='submit' className='btn btn-primary'>
									Submit Rating
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetail;
