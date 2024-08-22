import './PostCard.css';

const PostCard = ({ post, item, location, user }) => {
	return (
		<div className='card PostCard'>
			<img src='https://tinyurl.com/2a5vsg4a' className='card-img-top' alt='...' />
			<div className='card-body'>
				<h5 className='card-title'>{item.title}</h5>
				<p className='card-text description'>{item.description}</p>
			</div>
			<ul className='list-group list-group-flush'>
				<li className='list-group-item'>Price: ${item.price}</li>
				<li className='list-group-item'>Pickup Location: {location.street}</li>
				<li className='list-group-item'>Seller Rating: {user.rating}</li>
			</ul>
			<div className='card-body'>
				<button className="btn btn-primary">View Details</button>
			</div>
		</div>
	);
};

export default PostCard;
