import { renderHook, act } from '@testing-library/react';
import useFields from './useFields';

describe('useFields Hook', () => {
  test('should initialize formData with initialState', () => {
    const initialState = { name: 'John', age: 30 };
    const { result } = renderHook(() => useFields(initialState));

    expect(result.current[0]).toEqual(initialState);
  });

  test('should handle text input changes', () => {
    const initialState = { name: '', age: 0 };
    const { result } = renderHook(() => useFields(initialState));

    act(() => {
      result.current[1]({ target: { name: 'name', value: 'Jane', type: 'text' } });
    });

    expect(result.current[0].name).toBe('Jane');
  });

  test('should handle number input changes', () => {
    const initialState = { name: '', age: 0 };
    const { result } = renderHook(() => useFields(initialState));

    act(() => {
      result.current[1]({ target: { name: 'age', value: '25', type: 'number' } });
    });

    expect(result.current[0].age).toBe(25);
  });

  test('should update formData with setFormData', () => {
    const initialState = { name: '', age: 0 };
    const { result } = renderHook(() => useFields(initialState));

    act(() => {
      result.current[2]({ name: 'name', age: 30 });
    });

    expect(result.current[0]).toEqual({ name: 'name', age: 30 });
  });
});
