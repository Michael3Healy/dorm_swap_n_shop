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
	const [formData, handleChange] = useFields({
		phoneNumber: `${currUser.phoneNumber}`,
		email: `${currUser.email}`,
		firstName: `${currUser.firstName}`,
		lastName: `${currUser.lastName}`,
		profilePicture: `${currUser.profilePicture}`,
		password: '',
	});

	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
            const validationErrors = validate(formData);
			if (Object.keys(validationErrors).length > 0) {
                setError(validationErrors); // Set the specific validation errors
                return; // Prevent form submission if there are errors
            }
			// Update user data, verify password
			await ShopApi.updateUser(currUser.username, formData);

			// Delete password so it doesn't get saved in context
			delete formData.password;

			setCurrUser({ ...currUser, ...formData });
			navigate(`/users/${currUser.username}`);
		} catch (error) {
			setError(error);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='EditProfileForm container'>
			<div className='row justify-content-center mt-5'>
				<div className='col-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						{Object.keys(formData).map(key => (
							<div className='mb-4' key={key}>
								<label htmlFor={key} className='form-label required'>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</label>
								<input type={key === 'password' ? 'password' : 'text'} id={key} name={key} className='form-control' onChange={handleChange} value={formData[key]} required />
							</div>
						))}
						<button type='submit' className='btn btn-primary btn-block'>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProfileForm;
