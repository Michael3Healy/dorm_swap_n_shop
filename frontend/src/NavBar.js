import React from 'react';
import { Navbar, Nav, NavItem, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import UserContext from './userContext';
import { useContext, useState } from 'react';
import './NavBar.css';

const NavBar = ({ logout }) => {
	const { currUser } = useContext(UserContext);
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	const loggedInLinks = (
		<Nav className='ms-auto' navbar>
			<NavItem>
				<NavLink to='/posts' className='nav-link'>
					Listings
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/users' end className='nav-link'>
					Users
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/transactions' end className='nav-link'>
					Transactions
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to={`/users/${currUser.username}`} className='nav-link'>
					Profile
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/' onClick={logout} className='logout nav-link' >
					Logout
				</NavLink>
			</NavItem>
		</Nav>
	);

	const anonLinks = (
		<Nav className='ms-auto nav-list d-flex justify-content-end' navbar>
			<NavItem>
				<NavLink to='/login' className='nav-link'>
					Login
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink to='/register' className='nav-link'>
					Signup
				</NavLink>
			</NavItem>
		</Nav>
	);

	let links = currUser.username ? loggedInLinks : anonLinks;

	return (
		<Navbar expand='sm'>
			<NavLink to='/' className='brand'>
				Shop 'n' Swap
			</NavLink>
			<NavbarToggler onClick={toggle} />
			<Collapse isOpen={isOpen} navbar className='navbar-collapse'>
				{links}
			</Collapse>
		</Navbar>
	);
};

export default NavBar;
