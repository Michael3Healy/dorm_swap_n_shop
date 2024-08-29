import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should initialize with default value when localStorage is empty', () => {
    const key = 'testKey';
    const initialValue = 'defaultValue';
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(initialValue);
  });

  test('should initialize with value from localStorage if it exists', () => {
    const key = 'testKey';
    const initialValue = 'defaultValue';
    localStorage.setItem(key, JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe('storedValue');
  });

  test('should update localStorage when setting new value', () => {
    const key = 'testKey';
    const initialValue = 'defaultValue';
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem(key)).toBe(JSON.stringify('newValue'));
  });

  test('should handle setting null values', () => {
    const key = 'testKey';
    const initialValue = 'defaultValue';
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBe(null);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(null));
  });

  test('should handle errors during localStorage operations', () => {
    // Mock localStorage methods to throw errors
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('LocalStorage setItem error');
    });

    const key = 'testKey';
    const initialValue = 'defaultValue';
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current[1]('newValue');
    });

    // Check if the hook handles errors without crashing
    expect(result.current[0]).toBe('newValue'); // State should still be updated
    jest.restoreAllMocks();
  });
});
