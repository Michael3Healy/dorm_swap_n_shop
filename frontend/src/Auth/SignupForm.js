import useFields from '../hooks/useFields';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';
import ErrorAlert from '../ErrorAlert';
import { useState } from 'react';

const SignupForm = ({ register }) => {
	const [formData, handleChange] = useFields({ username: '', password: '', firstName: '', lastName: '', email: '', isAdmin: false, phoneNumber: '', profilePicture: '' });
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			if (!formData.profilePicture) formData.profilePicture = 'https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login'
			await register(formData);
			navigate('/');
		} catch (err) {
			setError(err);
		}
	};

	if (error) return <ErrorAlert error={error} />;

	return (
		<div className='SignupForm container'>
			<div className='row justify-content-center mt-5'>
				<div className='col-6'>
					<form className='bg-light p-4 rounded shadow-md' onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label htmlFor='username' className='form-label required'>
								Username
							</label>
							<input type='text' id='username' name='username' className='form-control' onChange={handleChange} value={formData.username} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='password' className='form-label required'>
								Password
							</label>
							<input type='password' id='password' name='password' className='form-control' onChange={handleChange} value={formData.password} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='firstName' className='form-label required'>
								First Name
							</label>
							<input type='text' id='firstName' name='firstName' className='form-control' onChange={handleChange} value={formData.firstName} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='lastName' className='form-label required'>
								Last Name
							</label>
							<input type='text' id='lastName' name='lastName' className='form-control' onChange={handleChange} value={formData.lastName} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='email' className='form-label required'>
								Email
							</label>
							<input type='email' id='email' name='email' className='form-control' onChange={handleChange} value={formData.email} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='phoneNumber' className='form-label required required'>
								Phone Number
							</label>
							<input type='tel' id='phoneNumber' name='phoneNumber' className='form-control' onChange={handleChange} value={formData.phoneNumber} required />
						</div>
						<div className='mb-4'>
							<label htmlFor='profilePicture' className='form-label'>
								Profile Picture
							</label>
							<input type='url' id='profilePicture' name='profilePicture' className='form-control' onChange={handleChange} value={formData.profilePicture} />
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

export default SignupForm;
