import '../Posts/PostCard.css';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const PlaceholderCard = () => {
	return (
		<div className='card PostCard'>
			<div className='img-container'>
				<img src={`${BASE_URL}/uploads/default-pic.png`} className='card-img-top' alt='...' />
			</div>
			<div className='card-body'>
				<h5 className='card-title'>Loading...</h5>
				<p className='card-text description'>Please wait...</p>
			</div>
			<ul className='list-group list-group-flush'>
				<li className='list-group-item'>Price: Loading...</li>
				<li className='list-group-item'>Pickup Location: Loading...</li>
				<li className='list-group-item'>Seller Rating: Loading...</li>
			</ul>
			<div className='card-body'>
				<button className='btn btn-primary' disabled>
					Loading...
				</button>
			</div>
		</div>
	);
};

export default PlaceholderCard;
