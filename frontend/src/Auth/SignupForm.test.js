import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from './SignupForm';
import { validate } from '../helpers/formValidation';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the ErrorAlert component
jest.mock('../ErrorAlert', () => () => <div>Error Alert</div>);

// Mock the form validation function
jest.mock('../helpers/formValidation', () => ({
  validate: jest.fn(),
}));

// Mock the register function
const mockRegister = jest.fn();
const mockValidate = validate;

describe('SignupForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with all inputs and submit button', () => {
    render(<SignupForm register={mockRegister} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    render(<SignupForm register={mockRegister} />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });

  test('handles file input changes correctly', () => {
    render(<SignupForm register={mockRegister} />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/profile picture/i), { target: { files: [file] } });
    
    expect(screen.getByLabelText(/profile picture/i).files[0]).toEqual(file);
    expect(screen.getByLabelText(/profile picture/i).files).toHaveLength(1);
  });

  test('shows validation errors if form is invalid', async () => {
    mockValidate.mockReturnValue({ email: 'Email is invalid' });
    render(<SignupForm register={mockRegister} />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } }); // Short password

    fireEvent.submit(screen.getByTestId('signup-form'));

    await waitFor(() => {
      expect(screen.getByText('Error Alert')).toBeInTheDocument();
    });
  });
});
