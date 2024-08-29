import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TransactionDetail from './TransactionDetail';
import ShopApi from '../api';

// Mock the API module
jest.mock('../api');
jest.mock('../LoadingScreen', () => () => <div>LoadingScreen</div>);

describe('TransactionDetail', () => {
  // Helper function to render component with router context
  const renderComponent = (route = '/transaction/1') => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/transaction/:transactionId" element={<TransactionDetail />} />
          <Route path="/" element={<div>Home Page</div>} /> {/* Add a basic home route */}
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading screen initially', () => {
    // Mock API to return pending promise
    ShopApi.getTransaction.mockImplementation(() => new Promise(() => {}));
    
    renderComponent();

    expect(screen.getByText('LoadingScreen')).toBeInTheDocument();
  });

  it('renders error when API fails', async () => {
    ShopApi.getTransaction.mockRejectedValue(new Error('Failed to fetch transaction'));

    renderComponent();

    // Wait for the component to handle the error
    await waitFor(() => expect(screen.getByText('Failed to fetch transaction')).toBeInTheDocument());
  });

  it('renders transaction details correctly', async () => {
    const mockTransaction = {
      id: 1,
      buyerUsername: 'buyer1',
      sellerUsername: 'seller1',
      price: 100,
      transactionDate: '2024-08-29',
      postId: 1,
      rated: false
    };
    const mockItem = { id: 1, title: 'Item Title' };

    ShopApi.getTransaction.mockResolvedValue(mockTransaction);
    ShopApi.getPost.mockResolvedValue({ itemId: 1 });
    ShopApi.getItem.mockResolvedValue(mockItem);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Transaction #1 Details')).toBeInTheDocument();
      expect(screen.getByText('buyer1')).toBeInTheDocument();
      expect(screen.getByText('seller1')).toBeInTheDocument();
      expect(screen.getByText('Item Title')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });
  });

  it('handles rating submission correctly', async () => {
    const mockTransaction = {
      id: 1,
      buyerUsername: 'buyer1',
      sellerUsername: 'seller1',
      price: 100,
      transactionDate: '2024-08-29',
      postId: 1,
      rated: false
    };
    const mockItem = { id: 1, title: 'Item Title' };

    ShopApi.getTransaction.mockResolvedValue(mockTransaction);
    ShopApi.getPost.mockResolvedValue({ itemId: 1 });
    ShopApi.getItem.mockResolvedValue(mockItem);
    ShopApi.rateUser.mockResolvedValue({});
    ShopApi.markTransactionAsRated.mockResolvedValue({});

    renderComponent();

    await waitFor(() => expect(screen.getByText('Rate the Seller')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Rating (1-5):'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Submit Rating'));

    await waitFor(() => {
      expect(ShopApi.rateUser).toHaveBeenCalledWith('buyer1', 'seller1', '5');
      expect(ShopApi.markTransactionAsRated).toHaveBeenCalledWith('1');
      expect(screen.getByText('You have already rated this transaction. Thank you!')).toBeInTheDocument();
    });
  });

  it('navigates home when Go Home button is clicked', async () => {
    const mockTransaction = {
      id: 1,
      buyerUsername: 'buyer1',
      sellerUsername: 'seller1',
      price: 100,
      transactionDate: '2024-08-29',
      postId: 1,
      rated: false
    };
    const mockItem = { id: 1, title: 'Item Title' };

    ShopApi.getTransaction.mockResolvedValue(mockTransaction);
    ShopApi.getPost.mockResolvedValue({ itemId: 1 });
    ShopApi.getItem.mockResolvedValue(mockItem);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Transaction #1 Details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Go Home'));

    // Make sure navigation occurs
    expect(window.location.pathname).toBe('/');
  });
});
