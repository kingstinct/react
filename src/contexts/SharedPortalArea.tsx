import { PortalProvider } from '@gorhom/portal'
import React, {
  useCallback, useContext, useMemo, useState,
} from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import NativePortal from '../components/NativePortal'

import type { PropsWithChildren } from 'react'
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native'

const SharedPortalAreaContext = React.createContext({
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
  setInsets: (insets: { readonly top: number, readonly bottom: number, readonly left: number, readonly right: number }) => {},
  setSize: (size: LayoutRectangle) => {},
})

export const SharedPortalAreaProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [{ width, height }, setSize] = useState<LayoutRectangle>({
    width: Dimensions.get('window').width,
    height: 0,
    x: 0,
    y: 0,
  })

  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  const value = useMemo(() => ({
    insets, size: { width, height }, setInsets, setSize,
  }), [insets, width, height])

  console.log('SharedPortalAreaProvider')

  return <PortalProvider>
    <SharedPortalAreaContext.Provider value={value}>
      {children}
    </SharedPortalAreaContext.Provider>
  </PortalProvider>
}

export const SharedPortalPresentationArea = ({ children }) => {
  const { setSize, insets } = useContext(SharedPortalAreaContext)

  console.log('SharedPortalPresentationArea')

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setSize(event.nativeEvent.layout)
  }, [])

  return <NativePortal>
    <View pointerEvents='box-none' style={[StyleSheet.absoluteFill, insets, { justifyContent: 'flex-end' }]}>
      <View onLayout={onLayout} style={{ backgroundColor: 'rgba(0,255,0,0.1)' }} pointerEvents='box-none'>
        { children }
      </View>
    </View>
  </NativePortal>
}
