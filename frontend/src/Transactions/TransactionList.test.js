// TransactionList.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TransactionList from './TransactionList';
import ShopApi from '../api';
import ErrorAlert from '../ErrorAlert';
import LoadingScreen from '../LoadingScreen';

// Mock the necessary modules
jest.mock('../api');
jest.mock('../ErrorAlert', () => () => <div>ErrorAlert</div>);
jest.mock('../LoadingScreen', () => () => <div>LoadingScreen</div>);

describe('TransactionList Component', () => {
  const mockTransactions = [
    { id: 1, buyerUsername: 'buyer1', sellerUsername: 'seller1', price: 100, transactionDate: '2024-08-29' },
    { id: 2, buyerUsername: 'buyer2', sellerUsername: 'seller2', price: 200, transactionDate: '2024-08-28' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading screen initially', () => {
    ShopApi.getTransactions.mockImplementation(() => new Promise(() => {})); // Mock pending promise
    render(
      <MemoryRouter>
        <TransactionList username="testUser" />
      </MemoryRouter>
    );
    expect(screen.getByText('LoadingScreen')).toBeInTheDocument();
  });

  test('renders error alert on failure', async () => {
    ShopApi.getTransactions.mockRejectedValue(new Error('Failed to fetch transactions'));
    render(
      <MemoryRouter>
        <TransactionList username="testUser" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('ErrorAlert')).toBeInTheDocument();
    });
  });

  test('renders no transactions found message when there are no transactions', async () => {
    ShopApi.getTransactions.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <TransactionList username="testUser" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('No transactions found')).toBeInTheDocument();
    });
  });

  test('does not show error alert for "No transactions found"', async () => {
    ShopApi.getTransactions.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <TransactionList username="testUser" />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText('ErrorAlert')).not.toBeInTheDocument();
    });
  });
});
