import useFields from '../hooks/useFields';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import UserContext from '../userContext';
import { validate } from '../helpers/formValidation';
import './NewPostForm.css';

const NewPostForm = () => {
	const [formData, handleChange] = useFields({
		image: '',
		description: '',
		price: '',
		category: '',
		title: '',
		pickupLocation: '',
		latitude: '',
		longitude: '',
	});
	const { currUser } = useContext(UserContext);

	const [selectedFile, setSelectedFile] = useState(null);
	const handleFileChange = e => setSelectedFile(e.target.files[0]);

	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const validationErrors = validate(formData);
			if (Object.keys(validationErrors).length > 0) {
				setError(validationErrors);
				return;
			}

			const formDataToSubmit = new FormData();
			Object.keys(formData).forEach(key => formDataToSubmit.append(key, formData[key]));
			if (selectedFile) formDataToSubmit.append('image', selectedFile);

			await ShopApi.createPost(currUser.username, formDataToSubmit);

			navigate('/posts');
		} catch (error) {
			setError(error);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='NewPostForm container'>
			<div className='row justify-content-center'>
				<div className='col-12 col-md-8 col-lg-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label htmlFor='itemImage' className='form-label'>
								Image
							</label>
							<input type='file' id='itemImage' name='itemImage' className='form-control' onChange={handleFileChange} />
						</div>
						<div className='row'>
							<div className='col-12 mb-4'>
								<label htmlFor='title' className='form-label required'>
									Title
								</label>
								<input type='text' id='title' name='title' className='form-control' onChange={handleChange} value={formData.title} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='description' className='form-label'>
									Description
								</label>
								<textarea id='description' name='description' className='form-control' onChange={handleChange} value={formData.description} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='price' className='form-label required'>
									Price
								</label>
								<input type='number' id='price' name='price' className='form-control' onChange={handleChange} value={formData.price} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='category' className='form-label'>
									Category
								</label>
								<input type='text' id='category' name='category' className='form-control' onChange={handleChange} value={formData.category} />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='pickupLocation' className='form-label'>
									Pickup Location
								</label>
								<input type='text' id='pickupLocation' name='pickupLocation' className='form-control' onChange={handleChange} value={formData.pickupLocation} />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='latitude' className='form-label'>
									Latitude
								</label>
								<input type='number' step='any' id='latitude' name='latitude' className='form-control' onChange={handleChange} value={formData.latitude} />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='longitude' className='form-label'>
									Longitude
								</label>
								<input type='number' step='any' id='longitude' name='longitude' className='form-control' onChange={handleChange} value={formData.longitude} />
							</div>
						</div>
						<button type='submit' className='btn btn-primary btn-block'>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewPostForm;
