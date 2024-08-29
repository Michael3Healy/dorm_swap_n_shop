import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import UserContext from './userContext';
import { useContext } from 'react';
import './NavBar.css';

const NavBar = ({ logout }) => {
	const { currUser } = useContext(UserContext);

	const loggedInLinks = (
		<Nav className='ml-auto' navbar>
			<NavItem>
				<NavLink to='/posts'>Listings</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/users' end>Users</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/transactions' end>Transactions</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to={`/users/${currUser.username}`}>Profile</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/' onClick={logout} className='logout'>
					Logout
				</NavLink>
			</NavItem>
		</Nav>
	);

	const anonLinks = (
		<Nav className='ml-auto' navbar>
			<NavItem>
				<NavLink to='/login'>Login</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/register'>Signup</NavLink>
			</NavItem>
		</Nav>
	);

	let links = currUser.username ? loggedInLinks : anonLinks;

	return (
		<Navbar expand='md'>
			<NavLink to='/' className='brand'>
				Shop 'n' Swap
			</NavLink>
			{links}
		</Navbar>
	);
};

export default NavBar;
