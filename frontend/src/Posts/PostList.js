import { useEffect, useState } from 'react';
import ShopApi from '../api';
import './PostList.css';
import LoadingScreen from '../LoadingScreen';
import ErrorAlert from '../ErrorAlert';
import PostCard from './PostCard';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useFields from '../hooks/useFields';
import SearchBar from '../common/SearchBar';
import PlaceholderCard from '../common/PlaceholderCard';

const PostList = ({ username }) => {
	const [posts, setPosts] = useState([]);
	const [items, setItems] = useState({});
	const [users, setUsers] = useState({});
	const [locations, setLocations] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchParams, handleChange, setSearchParams] = useFields({ posterUsername: '', itemName: '' });

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Get the search params from the URL and update the form data with them.
		const params = new URLSearchParams(location.search);
		const updatedSearchParams = {};
		for (let [key, value] of params) {
			updatedSearchParams[key] = value;
		}
		setSearchParams(updatedSearchParams);
		const fetchData = async () => {
			try {
				// Fetch posts with search params if they exist
				const searchTerms = { ...updatedSearchParams };
				if (username) searchTerms.posterUsername = username;

				const posts = await ShopApi.getPosts(searchTerms);

				const activePosts = [];

				// Fetch items for each post
				const items = {};
				await Promise.all(
					posts.map(async post => {
						const item = await ShopApi.getItem(post.itemId);
						if (!item.isSold) {
							items[post.itemId] = item;
							activePosts.push(post);
						}
					})
				);
				setItems(items);
				setPosts(activePosts);

				// Fetch locations for each post
				const locations = {};
				for (let post of posts) {
					const location = await ShopApi.getLocation(post.locationId);
					locations[post.locationId] = location;
				}
				setLocations(locations);

				// Fetch users for each post
				if (!username) {
					const users = {};
					for (let post of posts) {
						const user = await ShopApi.getUser(post.posterUsername);
						users[post.posterUsername] = user;
					}
					setUsers(users);
				} else {
					const user = await ShopApi.getUser(username);
					setUsers({ [username]: user });
				}

				setError(null);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [location.search]);

	const handleSubmit = async e => {
		e.preventDefault();

		// Remove empty search terms
		const searchTerms = {};
		const posterUsername = searchParams.posterUsername;
		const itemName = searchParams.itemName;
		if (posterUsername) searchTerms.posterUsername = posterUsername;
		if (itemName) searchTerms.itemName = itemName;

		// Update the URL with the search terms, triggering a re-fetch of the data from useEffect
		const search = new URLSearchParams({ ...searchTerms }).toString();
		navigate(`?${search}`);
	};

	return (
		<div className='PostList'>
			{error && <ErrorAlert error={error} />}
			<div className='upper'>
				{/* Search Form */}
				<SearchBar
					names={username ? ['itemName'] : ['posterUsername', 'itemName']}
					values={username ? [searchParams.itemName] : [searchParams.posterUsername, searchParams.itemName]}
					placeholders={username ? ['Item'] : ['Username', 'Item']}
					onChange={handleChange}
					handleSubmit={handleSubmit}
				/>
				{/* Add Post Button */}
				{!username && (
					<div className='add-post'>
						<Link to='/posts/new/location'>
							<button className='btn btn-main btn-add'>
								<i class='fa-solid fa-plus'></i>
							</button>
						</Link>
					</div>
				)}
			</div>
			{/* Post List */}
			{isLoading ? (
				<div className='PostList-posts container'>
					{Array.from({ length: 12 }).map((_, idx) => (
						<PlaceholderCard key={idx} />
					))}
				</div>
			) : (
				<>
					{posts.length === 0 ? (
						<h2>No posts found</h2>
					) : (
						<div className='PostList-posts container'>
							{posts.map(p => (
								<PostCard key={p.id} post={p} item={items[p.itemId] || {}} location={locations[p.locationId] || {}} user={users[p.posterUsername] || {}} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PostList;
