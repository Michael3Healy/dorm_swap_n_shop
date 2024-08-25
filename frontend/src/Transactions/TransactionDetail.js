import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShopApi from '../api';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
import './TransactionDetail.css';

const TransactionDetail = () => {
	const [transaction, setTransaction] = useState(null);
	const [error, setError] = useState(null);
	const [rating, setRating] = useState(0);
	const [alreadyRated, setAlreadyRated] = useState(false);
	const { transactionId } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch transaction details
		const fetchTransaction = async () => {
			try {
				const transactionData = await ShopApi.getTransaction(transactionId);
				setTransaction(transactionData);
				console.log(transactionData);

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
			const { buyerUsername, sellerUsername } = transaction;
			await ShopApi.rateUser(buyerUsername, sellerUsername, rating);
			await ShopApi.markTransactionAsRated(transactionId);
			setAlreadyRated(true);
		} catch (error) {
			console.error('Error submitting rating:', error);
			setError(error);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='TransactionDetail container'>
			<div className='transaction-detail'>
				<h1>Transaction Details</h1>
				<p>
					<strong>Buyer:</strong> {transaction.buyerUsername}
				</p>
				<p>
					<strong>Seller:</strong> {transaction.sellerUsername}
				</p>
				<p>
					<strong>Item:</strong> {transaction.itemName}
				</p>
				<p>
					<strong>Price:</strong> ${transaction.price}
				</p>
				<p>
					<strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleDateString()}
				</p>
				<div className='rating-section'>
					<h2>Rate the Seller</h2>
					{alreadyRated ? (
						<p>You have already rated this transaction. Thank you!</p>
					) : (
						<form onSubmit={handleSubmit}>
							<div className='form-group'>
								<label htmlFor='rating'>Rating (1-5):</label>
								<input type='number' transactionId='rating' name='rating' min='1' max='5' value={rating} onChange={handleRatingChange} required />
							</div>
							<button type='submit' className='btn btn-primary'>
								Submit Rating
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default TransactionDetail;
