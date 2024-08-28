import StarRating from '../common/StarRating';
import './PostCard.css';
import { Link } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const PostCard = ({ post, item, location, user }) => {
	return (
		<div className='card PostCard'>
			<div className='img-container'>
				<img src={`${BASE_URL}/${item.image}` || `${BASE_URL}/default-image.png`} className='card-img-top' alt='...' />
			</div>
			<div className='card-body'>
				<h5 className='card-title'>{item.title}</h5>
				<p className='card-text description'>{item.description}</p>
			</div>
			<ul className='list-group list-group-flush'>
				<li className='list-group-item'>Price: ${item.price}</li>
				<li className='list-group-item'>Pickup Location: {location.street}</li>
				<li className='list-group-item'>Seller Rating: {<StarRating rating={user.rating || 0} />}<span>({user.numRatings})</span></li>
			</ul>
			<div className='card-body'>
				<Link key={post.id} to={`/posts/${post.id}`} className='PostCard-cardLink'>
					<button className='btn btn-primary'>View Details</button>
				</Link>
			</div>
		</div>
	);
};

export default PostCard;
