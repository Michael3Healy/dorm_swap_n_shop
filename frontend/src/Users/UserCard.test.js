// UserCard.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserCard from './UserCard';
import ShopApi from '../api';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';

// Mock the necessary modules
jest.mock('../api');
jest.mock('../ErrorAlert', () => () => <div>ErrorAlert</div>);
jest.mock('../LoadingScreen', () => () => <div>LoadingScreen</div>);

describe('UserCard Component', () => {
  const mockUser = {
    username: 'testUser',
    profilePicture: 'testUser.jpg',
    posts: [{ id: 1 }, { id: 2 }],
    rating: 4.5,
    numRatings: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading screen initially', () => {
    ShopApi.getUser.mockImplementation(() => new Promise(() => {})); // Mock pending promise
    render(
      <MemoryRouter>
        <UserCard username="testUser" profilePicture="testUser.jpg" />
      </MemoryRouter>
    );
    expect(screen.getByText('LoadingScreen')).toBeInTheDocument();
  });

  test('renders error alert on failure', async () => {
    ShopApi.getUser.mockRejectedValue(new Error('Failed to fetch user'));
    render(
      <MemoryRouter>
        <UserCard username="testUser" profilePicture="testUser.jpg" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('ErrorAlert')).toBeInTheDocument();
    });
  });

  test('renders user data correctly', async () => {
    ShopApi.getUser.mockResolvedValue(mockUser);
    render(
      <MemoryRouter>
        <UserCard username="testUser" profilePicture="testUser.jpg" />
      </MemoryRouter>
    );
    await waitFor(() => {
      // Check for user profile picture
      expect(screen.getByAltText('testUser')).toHaveAttribute('src', 'http://localhost:3001/testUser.jpg');

      // Check for user details
      expect(screen.getByText('testUser')).toBeInTheDocument();
      expect(screen.getByText('Current Listings')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Number of posts
      expect(screen.getByText('Rating')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument(); // Rating
      expect(screen.getByText('#Ratings')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Number of ratings
    });
  });

  test('handles profile link correctly', async () => {
    ShopApi.getUser.mockResolvedValue(mockUser);
    render(
      <MemoryRouter>
        <UserCard username="testUser" profilePicture="testUser.jpg" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('View Profile')).toBeInTheDocument();
      // Verify the profile link
      expect(screen.getByText('View Profile').closest('a')).toHaveAttribute('href', '/users/testUser');
    });
  });
});
