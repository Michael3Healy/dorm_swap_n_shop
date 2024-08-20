import UserCard from '../Users/UserCard';
import { useContext } from 'react';
import UserContext from '../userContext';

const Profile = () => {
	const { currUser } = useContext(UserContext);

	return <div className='Profile container'></div>;
};

export default Profile;
