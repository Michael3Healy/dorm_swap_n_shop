import useFields from '../hooks/useFields';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import { useContext } from 'react';
import UserContext from '../userContext';

const NewItemForm = () => {
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { currUser } = useContext(UserContext);
	const [formData, handleChange] = useFields({
		image: '',
		description: '',
		price: '',
		category: '',
		title: '',
	});
	// Get the location data from the previous form
	const location = useLocation();
	const { locationData } = location.state || {};

	const [selectedFile, setSelectedFile] = useState(null);
	const handleFileChange = e => setSelectedFile(e.target.files[0]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			// Create form data object to submit in order to include image
			const formDataToSubmit = new FormData();
			Object.keys(formData).forEach(key => formDataToSubmit.append(key, formData[key]));
			formDataToSubmit.append('image', selectedFile);

			const { id: locationId } = await ShopApi.addLocation(locationData);
			const { id: itemId } = await ShopApi.addItem(formDataToSubmit);
			await ShopApi.createPost(currUser.username, itemId, locationId);
			navigate('/posts');
		} catch (error) {
			setError(error);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='NewItemForm container'>
			<h1>New Item Form</h1>
			<div className='row justify-content-center'>
				<div className='col-12 col-md-8 col-lg-6'>
					<form onSubmit={handleSubmit} className='bg-light p-4 rounded shadow-md'>
						<div className='row'>
							<div className='col-12 mb-4'>
								<label htmlFor='itemImage' className='form-label required'>
									Image
								</label>
								<input type='file' id='itemImage' name='itemImage' className='form-control' onChange={handleFileChange} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='title' className='form-label required'>
									Title
								</label>
								<input type='text' id='title' name='title' className='form-control' onChange={handleChange} value={formData.title} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='price' className='form-label required'>
									Price
								</label>
								<input type='number' id='price' name='price' className='form-control' onChange={handleChange} value={formData.price} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='description' className='form-label required'>
									Description
								</label>
								<textarea id='description' name='description' className='form-control' onChange={handleChange} value={formData.description} required />
							</div>
							<div className='col-12 mb-4'>
								<label htmlFor='category' className='form-label required'>
									Category
								</label>
								<input type='text' id='category' name='category' className='form-control' onChange={handleChange} value={formData.category} required />
							</div>
							<div className='col-12'>
								<button className='btn btn-success'>Submit</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewItemForm;
