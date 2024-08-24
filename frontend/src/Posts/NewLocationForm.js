import useFields from '../hooks/useFields';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import UserContext from '../userContext';
import { validate } from '../helpers/formValidation';
import { parseAddress } from '../helpers/parse';
import './NewLocationForm.css';

const NewLocationForm = () => {
	const [formData, handleChange] = useFields({ pickupLocation: '', latitude: '', longitude: '' });
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			// const validationErrors = validate(formData);
			// if (Object.keys(validationErrors).length > 0) {
			// 	setError(validationErrors);
			// 	return;
			// }

			const { street, city, zip, state } = parseAddress(formData.pickupLocation);

			// Append individual fields to `FormData`
			const formDataToSubmit = { street, city, zip, state, latitude: formData.latitude, longitude: formData.longitude };

			// await ShopApi.addLocation(formDataToSubmit);

            // Submit the location data all at once with the next form
			navigate('/posts/new/item', { state: { locationData: formDataToSubmit } });
		} catch (error) {
			setError(error);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='NewLocationForm container'>
			<div className='row justify-content-center'>
				<div className='col-12 col-md-8 col-lg-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						<div className='mb-4'>
							<div className='col-12 mb-4'>
								<label htmlFor='pickupLocation' className='form-label required'>
									Pickup Location (format as "123 Main St, City, State, Zip")
								</label>
								<input type='text' id='pickupLocation' name='pickupLocation' className='form-control' onChange={handleChange} value={formData.pickupLocation} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='latitude' className='form-label required'>
									Latitude
								</label>
								<input type='number' step='any' id='latitude' name='latitude' className='form-control' onChange={handleChange} value={formData.latitude} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='longitude' className='form-label required'>
									Longitude
								</label>
								<input type='number' step='any' id='longitude' name='longitude' className='form-control' onChange={handleChange} value={formData.longitude} required />
							</div>
						</div>
						<button type='submit' className='btn btn-secondary btn-block'>
							Next
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewLocationForm;
