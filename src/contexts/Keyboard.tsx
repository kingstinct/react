import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  useState, useEffect, useCallback, useMemo, createContext,
} from 'react'
import { Keyboard, Platform } from 'react-native'

import { useBoolean } from '../hooks'

import type { PropsWithChildren } from 'react'
import type { KeyboardEventListener } from 'react-native'

type ContextType = {
  readonly isUsingPhysicalKeyboard: boolean;
  readonly keyboardHeight: number;
  readonly willKeyboardBeShown: boolean,
  readonly isKeyboardShown: boolean,
}

const STORAGE_KEY = 'keyboardExternal'

const KeyboardContext = createContext<ContextType>({
  isKeyboardShown: false,
  isUsingPhysicalKeyboard: false,
  keyboardHeight: 0,
  willKeyboardBeShown: false,
})

// Setting up a breakpoint value for how small a virtual keyboard could be to be able to guess if the user is using an
// external keyboard.
const MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD = 100

/**
 * @description Calcuates whether or not the device being used has an external keyboard or not.
 * We will assume that it is not using an external keyboard if it is not on web platform.
 * BUT this 'setting should be saved in context, so it can be used again.
 * @returns Boolean
 */
export const KeyboardContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isUsingPhysicalKeyboard, setIsUsingPhysicalKeyboardInternal] = useState<boolean>(Platform.OS === 'web'),
        [keyboardHeight, setKeyboardHeight] = useState(0),
        [isKeyboardShown, setKeyboardVisible, setKeyboardHidden] = useBoolean(false),
        [willKeyboardBeShown, setWillKeyboardBeShown, setWillKeyboardBeHidden] = useBoolean(false),
        setIsUsingPhysicalKeyboard = useCallback(async (t: boolean): Promise<void> => {
          if (t !== isUsingPhysicalKeyboard) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(t))
            setIsUsingPhysicalKeyboardInternal(t)
          }
        }, [isUsingPhysicalKeyboard]),
        initIsUsingPhysicalKeyboard = useCallback(async (): Promise<void> => {
          const storedIsKeyboardExternal = await AsyncStorage.getItem(STORAGE_KEY)

          const storedToBoolean = storedIsKeyboardExternal ? JSON.parse(storedIsKeyboardExternal) as boolean : false
          setIsUsingPhysicalKeyboardInternal(storedToBoolean)
        }, [])

  useEffect(() => {
    void initIsUsingPhysicalKeyboard()
  }, [initIsUsingPhysicalKeyboard])

  useEffect(() => {
    const listener: KeyboardEventListener = (event) => {
      setKeyboardHeight(event.endCoordinates.height)
      setKeyboardVisible()
      void setIsUsingPhysicalKeyboard(event.endCoordinates.height < MAX_KEYBOARD_HEIGHT_WITH_EXTERNAL_KEYBOARD)
    }
    const didShow = Keyboard.addListener('keyboardDidShow', listener)
    const didHide = Keyboard.addListener('keyboardDidHide', setKeyboardHidden)
    const willShow = Keyboard.addListener('keyboardWillShow', setWillKeyboardBeShown)
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

  const state = useMemo(() => ({
    isKeyboardShown,
    isUsingPhysicalKeyboard,
    keyboardHeight,
    willKeyboardBeShown,
  }), [
    isUsingPhysicalKeyboard, keyboardHeight, willKeyboardBeShown, isKeyboardShown,
  ])

  return (
    <KeyboardContext.Provider value={state}>
      { children }
    </KeyboardContext.Provider>
  )
}

export const useIsUsingPhysicalKeyboard = () => {
  const { isUsingPhysicalKeyboard } = React.useContext(KeyboardContext)
  return isUsingPhysicalKeyboard
}

export const useKeyboardHeight = () => {
  const { keyboardHeight } = React.useContext(KeyboardContext)
  return keyboardHeight
}

export const useWillKeyboardBeShown = () => {
  const { willKeyboardBeShown } = React.useContext(KeyboardContext)
  return willKeyboardBeShown
}

export const useIsKeyboardShown = () => {
  const { isKeyboardShown } = React.useContext(KeyboardContext)
  return isKeyboardShown
}

export default KeyboardContext
