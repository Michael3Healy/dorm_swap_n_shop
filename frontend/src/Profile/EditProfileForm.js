import './EditProfileForm.css';
import useFields from '../hooks/useFields';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import ShopApi from '../api';
import { useContext } from 'react';
import UserContext from '../userContext';
import { validate } from '../helpers/formValidation';

const EditProfileForm = () => {
	const { currUser, setCurrUser } = useContext(UserContext);
	const fieldNames = {
		phoneNumber: `${currUser.phoneNumber}`,
		email: `${currUser.email}`,
		firstName: `${currUser.firstName}`,
		lastName: `${currUser.lastName}`,
		password: '',
	};
	const [formData, handleChange] = useFields(fieldNames);
	const [selectedFile, setSelectedFile] = useState(null);
	const handleFileChange = e => setSelectedFile(e.target.files[0]);

	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const validationErrors = validate(formData, ['phoneNumber', 'email', 'firstName', 'lastName', 'password']);
			if (Object.keys(validationErrors).length > 0) {
				setError(validationErrors); // Set the specific validation errors
				return; // Prevent form submission if there are errors
			}

			// Create form data object to submit in order to include profile picture
			const formDataToSubmit = new FormData();
			Object.keys(formData).forEach(key => formDataToSubmit.append(key, formData[key]));
			if (selectedFile) formDataToSubmit.append('profilePicture', selectedFile);

			// Update user data, verify password
			await ShopApi.updateUser(currUser.username, formDataToSubmit);

			// Delete password so it doesn't get saved in context
			delete formData.password;

			setCurrUser({ ...currUser, ...formDataToSubmit });
			navigate(`/users/${currUser.username}`);
		} catch (error) {
			setError(error);
		}
	};

	return (
		<div className='EditProfileForm container p-5'>
			{error && <ErrorAlert error={error} />}
			<div className='row justify-content-center'>
				<div className='col-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label htmlFor='profilePicture' className='form-label'>
								Profile Picture
							</label>
							<input type='file' id='profilePicture' name='profilePicture' className='form-control' onChange={handleFileChange} />
						</div>
						{Object.keys(formData).map(key => (
							<div className='mb-4' key={key}>
								<label htmlFor={key} className='form-label required'>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</label>
								<input type={key === 'password' ? 'password' : 'text'} id={key} name={key} className='form-control' onChange={handleChange} value={formData[key]} required />
							</div>
						))}
						<button type='button' className='btn btn-danger btn mx-2' onClick={() => navigate(`/users/${currUser.username}`)}>
							Cancel
						</button>
						<button type='submit' className='btn btn-primary btn mx-2'>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfileForm;
