import useFields from '../hooks/useFields';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ login }) => {
	const [formData, handleChange] = useFields({ username: '', password: '' });
	const navigate = useNavigate();

    // Error handled in App component (login function)
	const handleSubmit = async e => {
			e.preventDefault();
			await login(formData);
			navigate('/');
	};

	return (
		<div className='LoginForm container'>
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
						<button type='submit' className='btn btn-primary btn-block'>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
