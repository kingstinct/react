import { Keyboard } from 'react-native'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface KeyboardLayoutStore {
  // these properties are exposes through individual hooks
  readonly isKeyboardShown: boolean
  readonly keyboardHeight: number
  readonly willKeyboardBeShown: boolean

  // modifiers
  readonly setKeyboardVisible: () => void
  readonly setKeyboardHidden: () => void
  readonly setKeyboardHeight: (height: number) => void
  readonly setWillKeyboardBeShown: () => void
  readonly setWillKeyboardBeHidden: () => void
}

const useKeyboardLayoutStore = create<KeyboardLayoutStore>()(
  devtools(
    (set) => {
      Keyboard.addListener('keyboardDidShow', (event) => set({
        isKeyboardShown: true,
        keyboardHeight: event.endCoordinates.height,
      }))
      Keyboard.addListener('keyboardDidHide', () => set({ isKeyboardShown: false }))
      Keyboard.addListener('keyboardWillShow', () => set({ willKeyboardBeShown: true }))
      Keyboard.addListener('keyboardWillHide', () => set({ willKeyboardBeShown: false }))

      return {
        isKeyboardShown: false,
        keyboardHeight: 0,
        willKeyboardBeShown: false,
        setKeyboardVisible: () => set({ isKeyboardShown: true }),
        setKeyboardHidden: () => set({ isKeyboardShown: false }),
        setKeyboardHeight: (height) => set({ keyboardHeight: height }),
        setWillKeyboardBeShown: () => set({ willKeyboardBeShown: true }),
        setWillKeyboardBeHidden: () => set({ willKeyboardBeShown: false }),
      }
    },
  ),
)

export const useIsKeyboardShown = () => useKeyboardLayoutStore((state) => state.isKeyboardShown)

/**
 * The height of the keyboard will not be reset to 0 when the keyboard is hidden,
 * use {@link useIsKeyboardShown} to check if the keyboard is currently shown.
 */
export const useKeyboardHeight = () => useKeyboardLayoutStore((state) => state.keyboardHeight)

export const useWillKeyboardBeShown = () => useKeyboardLayoutStore((state) => state.willKeyboardBeShown)
