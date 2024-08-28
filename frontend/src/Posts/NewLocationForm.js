import useFields from '../hooks/useFields';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import { validate } from '../helpers/formValidation';
import './NewLocationForm.css';

const NewLocationForm = () => {
	const [formData, handleChange] = useFields({ street: '', city: '', state: '' });
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const validationErrors = validate(formData, ['street', 'city', 'state']);
			if (Object.keys(validationErrors).length > 0) {
				setError(validationErrors);
				return;
			}

			// Submit the location data all at once with the next form
			navigate('/posts/new/item', { state: { locationData: formData } });
		} catch (error) {
			console.error(error);
			setError('An error occurred while submitting the form, please try again');
		}
	};

	return (
		<div className='NewLocationForm container'>
			{error && <ErrorAlert error={error} />}
			<div className='row justify-content-center mt-3'>
				<div className='col-12 col-md-8 col-lg-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						<div className='mb-4'>
							<p className='text-center fs-2'>Pickup Location</p>
						</div>
						<div className='form-group'>
							<label htmlFor='street'>Street</label>
							<input type='text' className='form-control' id='street' name='street' placeholder='123 Main St.' onChange={handleChange} value={formData.street} required />
						</div>
						<div className='form-group'>
							<label htmlFor='city'>City</label>
							<input type='text' className='form-control' id='city' name='city' placeholder='San Francisco' onChange={handleChange} value={formData.city} required />
						</div>
						<div className='form-group'>
							<label htmlFor='state'>State</label>
							<input type='text' className='form-control' id='state' name='state' placeholder='CA' onChange={handleChange} value={formData.state} maxLength={2} required />
						</div>
						<button type='button' className='btn btn-cancel mt-4' onClick={() => navigate(-1)}>
							Cancel
						</button>
						<button type='submit' className='btn btn-secondary mt-4'>
							Next
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewLocationForm;
