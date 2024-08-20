import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './userContext';
import Home from './Home/Home';
import PostList from './Posts/PostList';
import PostDetail from './Posts/PostDetail';
import NewPostForm from './Posts/NewPostForm';
import EditPostForm from './Posts/EditPostForm';
import Profile from './Profile/Profile';
import EditProfileForm from './Profile/EditProfileForm';
import TransactionList from './Transactions/TransactionList';
import TransactionDetail from './Transactions/TransactionDetail';
import NotFound from './NotFound';
import UserList from './Users/UserList';

const RoutesList = ({ login, register }) => {

	return (
		<Routes>
			<Route path='/login' element={<LoginForm login={login} />} />
            <Route path='/register' element={<SignupForm register={register} />} />
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/users/:username' element={<Profile />} />
            <Route path='/users/:username/edit' element={<EditProfileForm />} />
            <Route path='/posts' element={<PostList />} />
            <Route path='/posts/new' element={<NewPostForm />} />
            <Route path='/posts/:id' element={<PostDetail />} />
            <Route path='/posts/:id/edit' element={<EditPostForm />} />
            <Route path='/transactions' element={<TransactionList />} />
            <Route path='/transactions/:transactionId' element={<TransactionDetail />} />
            <Route path='*' element={<NotFound />} />
		</Routes>
	);
};

export default RoutesList;