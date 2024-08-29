import { validate } from './formValidation';

describe('validate function', () => {
  it('should return an error for an invalid email', () => {
    const values = { email: 'invalidemail' };
    const fieldNames = ['email'];
    const errors = validate(values, fieldNames);
    expect(errors.email).toBe('Email is invalid');
  });

  it('should return an error for a short password', () => {
    const values = { password: '123' };
    const fieldNames = ['password'];
    const errors = validate(values, fieldNames);
    expect(errors.password).toBe('Password must be 6 or more characters');
  });

  it('should return an error for an invalid phone number', () => {
    const values = { phoneNumber: '123' };
    const fieldNames = ['phoneNumber'];
    const errors = validate(values, fieldNames);
    expect(errors.phoneNumber).toBe('Phone number must be a valid phone number');
  });

  it('should return an error for a first name with non-alphabetic characters', () => {
    const values = { firstName: 'John123' };
    const fieldNames = ['firstName'];
    const errors = validate(values, fieldNames);
    expect(errors.firstName).toBe('First name must contain only letters');
  });

  it('should return an error for a last name with non-alphabetic characters', () => {
    const values = { lastName: 'Doe!' };
    const fieldNames = ['lastName'];
    const errors = validate(values, fieldNames);
    expect(errors.lastName).toBe('Last name must contain only letters');
  });

  it('should return an error for an invalid URL', () => {
    const values = { url: 'htp:/invalid-url' };
    const fieldNames = ['url'];
    const errors = validate(values, fieldNames);
    expect(errors.url).toBe('URL is invalid');
  });

  it('should return an error for an invalid street address', () => {
    const values = { street: 'No numbers here' };
    const fieldNames = ['street'];
    const errors = validate(values, fieldNames);
    expect(errors.street).toBe('Street must include address number');
  });

  it('should return an error for an invalid city name', () => {
    const values = { city: 'City1' };
    const fieldNames = ['city'];
    const errors = validate(values, fieldNames);
    expect(errors.city).toBe('City name is invalid');
  });

  it('should return an error for an invalid state abbreviation', () => {
    const values = { state: 'XYZ' };
    const fieldNames = ['state'];
    const errors = validate(values, fieldNames);
    expect(errors.state).toBe('State must be a valid two-letter abbreviation');
  });

  it('should return an error for an invalid ZIP code', () => {
    const values = { zipCode: '1234' };
    const fieldNames = ['zipCode'];
    const errors = validate(values, fieldNames);
    expect(errors.zipCode).toBe('ZIP code is invalid');
  });

  it('should return no errors for valid inputs', () => {
    const values = {
      email: 'test@example.com',
      password: 'password123',
      phoneNumber: '+1-123-456-7890',
      firstName: 'John',
      lastName: 'Doe',
      url: 'https://example.com',
      street: '123 Main St.',
      city: 'New York',
      state: 'NY',
      zipCode: '12345-6789',
    };
    const fieldNames = [
      'email',
      'password',
      'phoneNumber',
      'firstName',
      'lastName',
      'url',
      'street',
      'city',
      'state',
      'zipCode',
    ];
    const errors = validate(values, fieldNames);
    expect(errors).toEqual({});
  });
});
