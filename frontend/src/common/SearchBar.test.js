import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  const defaultProps = {
    names: ['name1', 'name2'],
    values: ['value1', 'value2'],
    onChange: mockOnChange,
    placeholders: ['Placeholder 1', 'Placeholder 2'],
    handleSubmit: mockHandleSubmit,
    component: 'search-bar',
  };

  test('renders the correct number of inputs based on names array', () => {
    render(<SearchBar {...defaultProps} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(defaultProps.names.length);
  });

  test('renders inputs with correct placeholders and values', () => {
    render(<SearchBar {...defaultProps} />);
    
    defaultProps.names.forEach((name, i) => {
      const input = screen.getByPlaceholderText(defaultProps.placeholders[i]);
      expect(input).toHaveValue(defaultProps.values[i]);
    });
  });

  test('calls onChange handler when input value changes', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Placeholder 1');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders extra content when extra prop is provided', () => {
    const extraContent = <span>Extra Content</span>;
    render(<SearchBar {...defaultProps} extra={extraContent} />);
    
    expect(screen.getByText('Extra Content')).toBeInTheDocument();
  });

  test('does not render extra content when extra prop is not provided', () => {
    render(<SearchBar {...defaultProps} extra={null} />);
    
    expect(screen.queryByText('Extra Content')).not.toBeInTheDocument();
  });
});
