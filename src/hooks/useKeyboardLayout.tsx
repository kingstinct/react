import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { Keyboard, Platform } from 'react-native'
import { create } from 'zustand'

import type { KeyboardEventListener } from 'react-native'

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

const STORAGE_KEY = 'keyboardExternal'

const useKeyboardLayoutStore = create<KeyboardLayoutStore>((set) => ({
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
}))

// Setting up a breakpoint value for how small a virtual keyboard could be
// to be able to guess if the user is using an external keyboard.
const MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD = 100

/**
 * This hook should be placed in the root of the app and will engross the
 * information about whether an external or virtual keyboard is being used or not.
 *
 * Components that need to know about the keyboard layout should use
 * any of the following hooks:
 * {@link useIsKeyboardShown}
 * {@link useIsUsingPhysicalKeyboard}
 * {@link useKeyboardHeight}
 * {@link useWillKeyboardBeShown}
 *
 * This hook uses {@link https://github.com/pmndrs/zustand zustand} internally and replaces
 * the previous version of this library which was based on react context.
 */
export const useKeyboardLayout = () => {
  const setKeyboardHeight = useKeyboardLayoutStore((state) => state.setKeyboardHeight),
        setKeyboardVisible = useKeyboardLayoutStore((state) => state.setKeyboardVisible),
        setKeyboardHidden = useKeyboardLayoutStore((state) => state.setKeyboardHidden),
        setIsUsingPhysicalKeyboard = useKeyboardLayoutStore((state) => state.setIsUsingPhysicalKeyboard),
        setWillKeyboardBeShown = useKeyboardLayoutStore((state) => state.setWillKeyboardBeShown),
        setWillKeyboardBeHidden = useKeyboardLayoutStore((state) => state.setWillKeyboardBeHidden)

  useEffect(() => {
    const init = async () => {
      const storedIsKeyboardExternal = await AsyncStorage.getItem(STORAGE_KEY)

      const storedToBoolean = storedIsKeyboardExternal ? JSON.parse(storedIsKeyboardExternal) as boolean : false
      setIsUsingPhysicalKeyboard(storedToBoolean)
    }

    void init()
  }, [setIsUsingPhysicalKeyboard])

  useEffect(() => {
    const listener: KeyboardEventListener = (event) => {
      setKeyboardHeight(event.endCoordinates.height)
      setKeyboardVisible()
      setIsUsingPhysicalKeyboard(event.endCoordinates.height < MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD)
    }
    const didShow = Keyboard.addListener('keyboardDidShow', listener)
    const didHide = Keyboard.addListener('keyboardDidHide', setKeyboardHidden)
    const willShow = Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboardWillShow!!!!')
      setWillKeyboardBeShown()
    })
    const willHide = Keyboard.addListener('keyboardWillHide', setWillKeyboardBeHidden)

    return () => {
      didShow.remove()
      didHide.remove()
      willShow.remove()
      willHide.remove()
    }
  }, [
    setIsUsingPhysicalKeyboard, setKeyboardHidden, setWillKeyboardBeHidden, setWillKeyboardBeShown, setKeyboardHeight, setKeyboardVisible,
  ])
}

export const useIsKeyboardShown = () => useKeyboardLayoutStore((state) => state.isKeyboardShown)

export const useIsUsingPhysicalKeyboard = () => useKeyboardLayoutStore((state) => state.isUsingPhysicalKeyboard)

export const useKeyboardHeight = () => useKeyboardLayoutStore((state) => state.keyboardHeight)

export const useWillKeyboardBeShown = () => useKeyboardLayoutStore((state) => state.willKeyboardBeShown)

export default useKeyboardLayout
