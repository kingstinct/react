import AsyncStorage from '@react-native-async-storage/async-storage'
import { Keyboard, Platform } from 'react-native'
import { create } from 'zustand'

interface KeyboardLayoutStore {
  // these properties are exposes through individual hooks
  readonly isKeyboardShown: boolean
  readonly isUsingPhysicalKeyboard: boolean
  readonly keyboardHeight: number
  readonly willKeyboardBeShown: boolean

  // modifiers
  readonly setKeyboardVisible: () => void
  readonly setKeyboardHidden: () => void
  readonly setIsUsingPhysicalKeyboard: (value: boolean) => void
  readonly setKeyboardHeight: (height: number) => void
  readonly setWillKeyboardBeShown: () => void
  readonly setWillKeyboardBeHidden: () => void
}

// Setting up a breakpoint value for how small a virtual keyboard could be
// to be able to guess if the user is using an external keyboard.
const MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD = 100

const STORAGE_KEY = 'keyboardExternal'

const useKeyboardLayoutStore = create<KeyboardLayoutStore>((set) => {
  const init = async () => {
    const storedIsKeyboardExternal = await AsyncStorage.getItem(STORAGE_KEY)

    set({ isUsingPhysicalKeyboard: storedIsKeyboardExternal ? JSON.parse(storedIsKeyboardExternal) as boolean : false })
  }

  void init()

  Keyboard.addListener('keyboardDidShow', (event) => set({
    isKeyboardShown: true,
    isUsingPhysicalKeyboard: event.endCoordinates.height < MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD,
    keyboardHeight: event.endCoordinates.height,
  }))
  Keyboard.addListener('keyboardDidHide', () => set({ isKeyboardShown: false }))
  Keyboard.addListener('keyboardWillShow', () => set({ willKeyboardBeShown: true }))
  Keyboard.addListener('keyboardWillHide', () => set({ willKeyboardBeShown: false }))

  return {
    isKeyboardShown: false,
    isUsingPhysicalKeyboard: Platform.OS === 'web',
    keyboardHeight: 0,
    willKeyboardBeShown: false,
    setKeyboardVisible: () => set(() => ({ isKeyboardShown: true })),
    setKeyboardHidden: () => set(() => ({ isKeyboardShown: false })),
    setIsUsingPhysicalKeyboard: (value) => set((state) => {
      if (value !== state.isUsingPhysicalKeyboard) {
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }
      return {
        isUsingPhysicalKeyboard: value,
      }
    }),
    setKeyboardHeight: (height) => set(() => ({ keyboardHeight: height })),
    setWillKeyboardBeShown: () => set(() => ({ willKeyboardBeShown: true })),
    setWillKeyboardBeHidden: () => set(() => ({ willKeyboardBeShown: false })),
  }
})

export const useIsKeyboardShown = () => useKeyboardLayoutStore((state) => state.isKeyboardShown)

export const useIsUsingPhysicalKeyboard = () => useKeyboardLayoutStore((state) => state.isUsingPhysicalKeyboard)

/**
 * The height of the keyboard will not be reset to 0 when the keyboard is hidden,
 * use {@link useIsKeyboardShown} to check if the keyboard is currently shown.
 */
export const useKeyboardHeight = () => useKeyboardLayoutStore((state) => state.keyboardHeight)

export const useWillKeyboardBeShown = () => useKeyboardLayoutStore((state) => state.willKeyboardBeShown)
