import './Home.css';
import { useEffect } from 'react';
import TransactionDetailSS from '../images/TransactionDetail.png';
import TransactionCardSS from '../images/TransactionCard.png';
import UsersListSS from '../images/UsersList.png';
import PostDetailSS from '../images/PostDetail.png';
import PostsListSS from '../images/PostsList.png';
import ProfileSS from '../images/Profile.png';

const Home = () => {
	useEffect(() => {
		const loadBootstrap = async () => {
			const bootstrap = (await import('bootstrap/dist/js/bootstrap.bundle.min.js')).default;
			const myCarouselElement = document.querySelector('#Home-carousel');
			if (myCarouselElement) {
				new bootstrap.Carousel(myCarouselElement, {
					interval: 2000,
					touch: false,
				});
			}
		};

		loadBootstrap();
	}, []);
	return (
		<div className='Home container text-center'>
			<div className='container'>
				<h1 className='display-1'>Welcome to Dorm Swap 'n' Shop</h1>
				<h5 className='display-5 mb-3'>The Online Marketplace for College Students</h5>
				<div className='row '>
					<div id='Home-carousel' className='carousel carousel-dark slide p-0'>
						<div className='carousel-indicators'>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='0' className='active'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='1'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='2'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='3'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='4'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='5'></button>
						</div>
						<div className='carousel-inner'>
							<div className='carousel-item active'>
								<img src={PostsListSS} className='d-block w-100' alt='...'/>
								<div className='carousel-caption d-none d-md-block'>
									<h5>Listings</h5>
									<p>View current listings and search according to username or item</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src={PostDetailSS} className='d-block w-100' alt='...' data-testid='posts-list-slide'/>
								<div className='carousel-caption d-none d-md-block'>
									<h5>Item Details</h5>
									<p>Easily purchase items and see a map with pickup location</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src={TransactionCardSS} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Transaction History</h5>
									<p>View all personal transactions in an organized list</p>
								</div>
							</div>

							<div className='carousel-item' data-bs-interval='10000'>
								<img src={TransactionDetailSS} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Transaction Details</h5>
									<p>View info on every personal transaction and provide a rating for the seller</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src={UsersListSS} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Users Page</h5>
									<p>Search for users and view their ratings and profiles</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src={ProfileSS} className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Profile Page</h5>
									<p>Edit your profile and view your current posts</p>
								</div>
							</div>
						</div>
						<button className='carousel-control-prev' type='button' data-bs-target='#Home-carousel' data-bs-slide='prev'>
							<span className='carousel-control-prev-icon'></span>
							<span className='visually-hidden'>Previous</span>
						</button>
						<button className='carousel-control-next' type='button' data-bs-target='#Home-carousel' data-bs-slide='next'>
							<span className='carousel-control-next-icon'></span>
							<span className='visually-hidden'>Next</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
