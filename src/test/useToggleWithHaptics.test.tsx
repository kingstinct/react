import { renderHook, act } from '@testing-library/react-hooks'
import useToggleWithHaptics from '../useToggleWithHaptics'

describe('useToggleWithHaptics', () => {
  it('switch from false to true', () => {
    jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }))
    jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn() }))

    const { result } = renderHook(() => useToggleWithHaptics())
    
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  });

  it('switch from true to false', () => {
    jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }))
    jest.mock('expo-haptics', () => ({ default: { selectionAsync: jest.fn() }}))
    
    const { result } = renderHook(() => useToggleWithHaptics(true))
    
    expect(result.current[0]).toBe(true)

      act(() => {
        result.current[1]()
      })

      expect(result.current[0]).toBe(false)
  });
});
