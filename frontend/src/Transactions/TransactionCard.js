import { useState, useEffect } from 'react';
import ShopApi from '../api';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';
import './TransactionCard.css';
import { Link } from 'react-router-dom';

const TransactionCard = ({ id }) => {
	const [transaction, setTransaction] = useState(null);
	const [item, setItem] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Fetch transaction Cards
		const fetchTransaction = async () => {
			try {
				const transactionData = await ShopApi.getTransaction(id);
				setTransaction(transactionData);

				const postData = await ShopApi.getPost(transactionData.postId);

				const itemData = await ShopApi.getItem(postData.itemId);
				setItem(itemData);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTransaction();
	}, []);

	if (isLoading) return <LoadingScreen />;

	return (
		<div className='TransactionCard container'>
			{error && <ErrorAlert error={error} />}
			<div className='transaction-card'>
				<h3>Transaction #{id}</h3>
				<div className='transaction-info'>
					<p>
						<strong>Buyer:</strong> {transaction.buyerUsername}
					</p>
					<p>
						<strong>Seller:</strong> {transaction.sellerUsername}
					</p>
					<p>
						<strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleDateString()}
					</p>
				</div>
                <Link to={`/transactions/${id}`} className='btn btn-primary justify-self-end'>View Details</Link>
			</div>
		</div>
	);
};

export default TransactionCard;
