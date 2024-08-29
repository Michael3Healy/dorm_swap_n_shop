// UserList.test.js
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserList from './UserList';
import ShopApi from '../api';

// Mock the necessary modules
jest.mock('../api');
jest.mock('../ErrorAlert', () => () => <div>ErrorAlert</div>);
jest.mock('./UserCard', () => ({ username, profilePicture }) => (
  <div>
    <h3>{username}</h3>
    <img src={profilePicture} alt={username} />
  </div>
));

describe('UserList Component', () => {
  const mockUsers = [
    { username: 'user1', profilePicture: 'user1.jpg' },
    { username: 'user2', profilePicture: 'user2.jpg' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders error alert when API call fails', async () => {
    ShopApi.getUsers.mockRejectedValue(new Error('Failed to fetch users'));
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('ErrorAlert')).toBeInTheDocument();
    });
  });

  test('renders user cards correctly', async () => {
    ShopApi.getUsers.mockResolvedValue(mockUsers);
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByAltText('user1')).toHaveAttribute('src', 'user1.jpg');
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByAltText('user2')).toHaveAttribute('src', 'user2.jpg');
    });
  });

  test('handles search form submission', async () => {
    ShopApi.getUsers.mockResolvedValue(mockUsers);
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<UserList />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user1' } });
    fireEvent.click(screen.getByText('Search')); // Assuming 'Search' is the text on the submit button

    await waitFor(() => {
      expect(ShopApi.getUsers).toHaveBeenCalledWith({ username: 'user1' });
    });
  });
});
