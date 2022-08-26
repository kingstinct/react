import { PortalProvider } from '@gorhom/portal'
import { nanoid } from 'nanoid'
import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react'
import { Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import NativePortal from '../components/NativePortal'

import type { PropsWithChildren } from 'react'
import type {
  LayoutChangeEvent, LayoutRectangle, ViewStyle,
  StyleProp,
  Insets,
} from 'react-native'

const SharedPortalAreaContextDefaultValue = {
  insets: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  size: {
    width: Dimensions.get('window').width,
    height: 0,
  },
  pushInset: (insets: InsetsWithId) => {},
  removeInset: (id: string) => {},
  setSize: (size: LayoutRectangle) => {},
}

export const SharedPortalAreaContext = React.createContext(SharedPortalAreaContextDefaultValue)

type InsetsWithId = Required<Insets> & {readonly id: string}

const DEFAULT_INSETS = {
  top: 0, bottom: 0, left: 0, right: 0,
}

export const SharedPortalAreaProvider: React.FC<PropsWithChildren<{readonly insets?: Insets}>> = ({ children, insets }) => {
  const defaultInsets = useMemo<Required<Insets>>(() => (insets ? { ...DEFAULT_INSETS, ...insets } : DEFAULT_INSETS), [insets])
  const [{ width, height }, setSize] = useState<LayoutRectangle>({
    width: Dimensions.get('window').width,
    height: 0,
    x: 0,
    y: 0,
  })

  const [allCustomInsets, setInsets] = useState<readonly InsetsWithId[]>([])

  const calculatedInset = useMemo(() => {
    // eslint-disable-next-line unicorn/prefer-at
    const lastInset = allCustomInsets[allCustomInsets.length - 1]
    return lastInset ? { ...defaultInsets, ...lastInset } : defaultInsets
  }, [allCustomInsets, defaultInsets])

  const removeInset = useCallback((id: string) => setInsets((prev) => prev.filter(({ id: prevId }) => prevId !== id)), [])

  const pushInset = useCallback((i: InsetsWithId) => {
    setInsets((prev) => [...prev, i])
  }, [])

  const value = useMemo<typeof SharedPortalAreaContextDefaultValue>(() => ({
    insets: {
      bottom: calculatedInset.bottom, left: calculatedInset.left, right: calculatedInset.right, top: calculatedInset.top,
    },
    size: { width, height },
    setInsets,
    setSize,
    removeInset,
    pushInset,
  }), [
    calculatedInset.bottom, width, height, removeInset, pushInset, calculatedInset.left, calculatedInset.right, calculatedInset.top,
  ])

  return (
    <PortalProvider>
      <SharedPortalAreaContext.Provider value={value}>
        {children}
      </SharedPortalAreaContext.Provider>
    </PortalProvider>
  )
}

// explicitely set all insets
export const useUpdateSharedPortalAreaInsets = (insets: Required<Insets>, enable = true) => {
  const { pushInset, removeInset } = useContext(SharedPortalAreaContext)

  useEffect(() => {
    if (enable) {
      const id = nanoid()
      pushInset({ ...insets, id })
      return () => removeInset(id)
    }
    return () => {}
  }, [
    enable, insets, pushInset, removeInset,
  ])
}

// set insets, but with safe area as default
export const useUpdateSharedPortalSafeAreaInsets = (insets: Insets, enable = true) => {
  const safeAreaInsets = useSafeAreaInsets()
  const { pushInset, removeInset } = useContext(SharedPortalAreaContext)

  useEffect(() => {
    if (enable) {
      const id = nanoid()
      pushInset({ ...safeAreaInsets, ...insets, id })
      return () => removeInset(id)
    }
    return () => {}
  }, [
    safeAreaInsets, insets, enable, pushInset, removeInset,
  ])
}

export const SharedPortalPresentationArea: React.FC<PropsWithChildren<{ readonly style?: StyleProp<ViewStyle> }>> = ({ children, style }) => {
  const { setSize, insets } = useContext(SharedPortalAreaContext)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setSize(event.nativeEvent.layout)
  }, [setSize])

  return (
    <NativePortal insets={insets}>

      <View onLayout={onLayout} style={[style]} pointerEvents='box-none'>
        { children }
      </View>

    </NativePortal>
  )
}
