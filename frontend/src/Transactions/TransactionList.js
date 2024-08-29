import { useEffect, useState } from 'react';
import ShopApi from '../api';
import './TransactionList.css';
import TransactionCard from './TransactionCard';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';

const TransactionList = ({ username }) => {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetches transactions for signed in user. Filtered in backend based on JWT.
				const transactions = await ShopApi.getTransactions();

				setTransactions(transactions);

				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className='TransactionList p-5'>
			{error && error[0] !== 'No transactions found' && <ErrorAlert error={error} />}
            <h1 style={{color: 'white'}}>Personal Transactions</h1>
			{/* Post List */}
			{isLoading ? (
				<LoadingScreen />
			) : (
				<>
					{transactions.length === 0 ? (
						<h2>No transactions found</h2>
					) : (
						<div className='TransactionList-transactions container'>
							{transactions.map(t => (
								<TransactionCard key={t.id} id={t.id} buyer={t.buyerUsername} seller={t.sellerUsername} price={t.price} transactionDate={t.transactionDate} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default TransactionList;
