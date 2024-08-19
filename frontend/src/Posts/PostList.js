import { useEffect, useState } from 'react';
import ShopApi from '../api';
import './PostList.css';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';

const PostList = () => {
	const [posts, setPosts] = useState([]);
	const [items, setItems] = useState({});
	const [users, setUsers] = useState({});
	const [locations, setLocations] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const posts = await ShopApi.getPosts();
				setPosts(posts);

				// Fetch items for each post
				const items = {};
				for (let post of posts) {
					const item = await ShopApi.getItem(post.itemId);
					items[post.itemId] = item;
				}
				setItems(items);

				// Fetch locations for each post
				const locations = {};
				for (let post of posts) {
					const location = await ShopApi.getLocation(post.locationId);
					locations[post.locationId] = location;
				}
				setLocations(locations);

				const users = {};
				for (let post of posts) {
					const user = await ShopApi.getUser(post.posterUsername);
					users[post.posterUsername] = user;
				}
				setUsers(users);

				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) return <LoadingScreen />;

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='PostList container'>
			{posts.map(p => (
				<Link to={`/posts/${p.id}`} className='PostList-cardLink'>
					<PostCard key={p.id} post={p} item={items[p.itemId]} location={locations[p.locationId]} user={users[p.posterUsername]} />
				</Link>
			))}
		</div>
	);
};

export default PostList;
