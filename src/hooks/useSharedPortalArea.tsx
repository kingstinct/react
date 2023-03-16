import { PortalProvider } from '@gorhom/portal'
import { nanoid } from 'nanoid'
import React, { useCallback, useEffect } from 'react'
import { Dimensions } from 'react-native'
import Animated, { CurvedTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { create } from 'zustand'

import NativePortal from '../components/NativePortal'

import type { PropsWithChildren } from 'react'
import type {
  LayoutChangeEvent, LayoutRectangle, ViewStyle, StyleProp, Insets,
} from 'react-native'

type InsetsWithId = Required<Insets> & { readonly id: string }

interface SharedPortalAreaStore {
  readonly allCustomInsets: readonly InsetsWithId[]
  readonly defaultInsets: Required<Insets>
  readonly setDefaultInsets: (defaultInsets: Required<Insets>) => void
  readonly insets: Required<Insets>
  readonly size: LayoutRectangle
  readonly pushInset: (insets: InsetsWithId) => void
  readonly removeInset: (id: string) => void
  readonly setSize: (size: LayoutRectangle) => void
}

function calculateInset(allCustomInsets: SharedPortalAreaStore['allCustomInsets'], defaultInsets: SharedPortalAreaStore['defaultInsets']) {
  // eslint-disable-next-line unicorn/prefer-at
  const lastInset = allCustomInsets[allCustomInsets.length - 1]
  return lastInset ? { ...defaultInsets, ...lastInset } : defaultInsets
}

const useSharedPortalArea = create<SharedPortalAreaStore>((set, get) => ({
  allCustomInsets: [],
  defaultInsets: {
    top: 0, bottom: 0, left: 0, right: 0,
  },
  setDefaultInsets: (defaultInsets: Required<Insets>) => set(() => ({
    defaultInsets,
    insets: calculateInset(get().allCustomInsets, defaultInsets),
  })),
  insets: {
    top: 0, bottom: 0, left: 0, right: 0,
  },
  size: {
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: 0,
  },
  pushInset: (insets: InsetsWithId) => set((state) => {
    const allCustomInsets = [...state.allCustomInsets, insets]

    return {
      allCustomInsets,
      insets: calculateInset(allCustomInsets, state.defaultInsets),
    }
  }),
  removeInset: (id: string) => set((state) => {
    const allCustomInsets = state.allCustomInsets.filter(({ id: prevId }) => prevId !== id)

    return {
      allCustomInsets,
      insets: calculateInset(allCustomInsets, state.defaultInsets),
    }
  }),
  setSize: (size: LayoutRectangle) => set(() => ({ size })),
}))

export const SharedPortalAreaProvider: React.FC<PropsWithChildren<{readonly insets?: Insets}>> = ({ children, insets }) => {
  const setDefaultInsets = useSharedPortalArea((state) => state.setDefaultInsets)

  useEffect(() => {
    setDefaultInsets({
      top: 0, bottom: 0, left: 0, right: 0, ...(insets ?? {}),
    })
  }, [insets, setDefaultInsets])

  return (
    <PortalProvider>
      {children}
    </PortalProvider>
  )
}

// explicitely set all insets
export const useUpdateSharedPortalAreaInsets = (insets: Required<Insets>, enable = true) => {
  const pushInset = useSharedPortalArea((state) => state.pushInset)
  const removeInset = useSharedPortalArea((state) => state.removeInset)

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

// Set insets, but with safe area as default
export const useUpdateSharedPortalSafeAreaInsets = (insets: Insets, enable = true) => {
  const safeAreaInsets = useSafeAreaInsets()
  const pushInset = useSharedPortalArea((state) => state.pushInset)
  const removeInset = useSharedPortalArea((state) => state.removeInset)

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

type SharedPortalPresentationAreaProps = PropsWithChildren<{ readonly style?: StyleProp<ViewStyle>, readonly colorize?: boolean }>

export const SharedPortalPresentationArea: React.FC<SharedPortalPresentationAreaProps> = ({
  children,
  style,
  colorize,
}) => {
  const insets = useSharedPortalArea((state) => state.insets)
  const setSize = useSharedPortalArea((state) => state.setSize)

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setSize(event.nativeEvent.layout)
  }, [setSize])

  return (
    <NativePortal insets={insets} colorize={colorize}>
      <Animated.View
        layout={CurvedTransition.duration(500)}
        onLayout={onLayout}
        style={style}
        pointerEvents='box-none'
      >
        { children }
      </Animated.View>
    </NativePortal>
  )
}

export const useSharedPortalAreaInsets = () => useSharedPortalArea((state) => state.insets)

export const useSharedPortalAreaSize = () => useSharedPortalArea((state) => state.size)
