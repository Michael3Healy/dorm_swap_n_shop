import './NotFound.css';

const NotFound = () => {
	return (
		<div className="NotFound">
			<h1>404 - Not Found!</h1>
			<p>The page you are looking for does not exist.</p>
			<p>
				Click <a href='/'>here</a> to go back to the home page.
			</p>
		</div>
	);
};

export default NotFound;
