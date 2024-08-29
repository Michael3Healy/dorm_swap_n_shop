import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter as Router, useNavigate } from 'react-router-dom';
import PostList from './PostList';
import ShopApi from '../api';
// Mock the API module
jest.mock('../api');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
	return { ...jest.requireActual('react-router-dom'), useNavigate: () => mockNavigate };
});

describe('PostList', () => {
	const renderComponent = () => {
		render(
			<Router>
				<PostList />
			</Router>
		);
	};

	test('renders error message if API call fails', async () => {
		ShopApi.getPosts.mockRejectedValue(new Error('API is down'));

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('API is down')).toBeInTheDocument();
		});
	});

	test('renders post cards when API call is successful', async () => {
		const mockPosts = [
			{ id: 1, posterUsername: 'user1', itemId: 1, locationId: 1 },
			{ id: 2, posterUsername: 'user2', itemId: 2, locationId: 2 },
		];
		const mockItems = {
			1: { id: 1, title: 'Item 1' },
			2: { id: 2, title: 'Item 2' },
		};

		ShopApi.getPosts.mockResolvedValue(mockPosts);
		ShopApi.getItem.mockImplementation(id => Promise.resolve(mockItems[id]));

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
		});
	});

	test('handles form submission and updates URL with search term', async () => {
		ShopApi.getPosts.mockResolvedValue([]);
		renderComponent();

		await waitFor(() => {
			fireEvent.change(screen.getByPlaceholderText('Item'), { target: { value: 'search term' } });
			fireEvent.submit(screen.getByRole('button', { name: /search/i }));

			expect(mockNavigate).toHaveBeenCalledWith('?itemName=search+term');
		});
	});
});
