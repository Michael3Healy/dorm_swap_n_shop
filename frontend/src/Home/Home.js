import './Home.css';
import { useEffect } from 'react';

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
				<div className='row'>
					<div className='col-12'>
						<h1 className=''>Welcome to Dorm Shop 'n' Swap</h1>
					</div>
				</div>
				<div className='row'>
					<div id='Home-carousel' className='carousel carousel-dark slide'>
						<div className='carousel-indicators'>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='0' className='active'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='1'></button>
							<button type='button' data-bs-target='#Home-carousel' data-bs-slide-to='2'></button>
						</div>
						<div className='carousel-inner'>
							<div className='carousel-item active' data-bs-interval='10000'>
								<img src='https://tinyurl.com/2a5vsg4a' className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>First slide label</h5>
									<p>Some representative placeholder content for the first slide.</p>
								</div>
							</div>
							<div className='carousel-item' data-bs-interval='2000'>
								<img src='https://tinyurl.com/2a5vsg4a' className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Second slide label</h5>
									<p>Some representative placeholder content for the second slide.</p>
								</div>
							</div>
							<div className='carousel-item'>
								<img src='https://tinyurl.com/2a5vsg4a' className='d-block w-100' alt='...' />
								<div className='carousel-caption d-none d-md-block'>
									<h5>Third slide label</h5>
									<p>Some representative placeholder content for the third slide.</p>
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
