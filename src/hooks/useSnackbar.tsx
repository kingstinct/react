import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { create } from 'zustand'

import { DefaultSnackbarComponent } from '../components'
import { DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME, DEFAULT_SNACKBAR_TIMOUT_MS } from '../contexts/Snackbar'
import { randomHexColorAlpha } from '../utils'
import getRandomID from '../utils/getRandomID'

import type { SnackbarComponentProps } from '../components/SnackbarComponent'
import type { AddSnackbarFn, SnackbarWithId, SnackbarConfig } from '../contexts/Snackbar'
import type { StyleProp, ViewStyle } from 'react-native'

export * from '../components/SnackbarComponent'

interface SnackbarStore {
  readonly defaultTimeoutMs: number
  readonly setDefaultTimeoutMs: (timeout: number | undefined) => void
  readonly snackbarsToShowAtSameTime: number
  readonly setSnackbarsToShowAtSameTime: (value: number | undefined) => void

  readonly snackbars: readonly SnackbarWithId[]
  readonly snackbarsToShow: readonly SnackbarWithId[]

  readonly addSnackbar: AddSnackbarFn
  readonly removeSnackbar: (id: string) => void
  readonly snackbarWasPresented: (id: string) => void
}

let hasWarned = false
const timeouts = new Map<string, number>()

const useSnackbarStore = create<SnackbarStore>((set) => ({
  defaultTimeoutMs: DEFAULT_SNACKBAR_TIMOUT_MS,
  setDefaultTimeoutMs: (timeout) => set(() => ({ defaultTimeoutMs: timeout ?? DEFAULT_SNACKBAR_TIMOUT_MS })),
  snackbarsToShowAtSameTime: DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME,
  setSnackbarsToShowAtSameTime: (value) => set((state) => {
    const snackbarsToShowAtSameTime = value ?? DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME

    return {
      snackbarsToShow: state.snackbars.slice(0, snackbarsToShowAtSameTime),
      snackbarsToShowAtSameTime,
    }
  }),
  snackbars: [],
  snackbarsToShow: [],
  addSnackbar: (snackbarConfig) => set((state) => {
    const snackbars = [
      ...state.snackbars,
      {
        snackbarConfig: {
          ...snackbarConfig,
          type: snackbarConfig.type as never, // here is where type safety ends
          data: snackbarConfig.data as never,
        },
        id: snackbarConfig.id || getRandomID(),
      },
    ]

    return {
      snackbars,
      snackbarsToShow: snackbars.slice(0, state.snackbarsToShowAtSameTime),
    }
  }),
  removeSnackbar: (id: string) => set((state) => {
    const snackbars = state.snackbars.filter((s) => s.id !== id)

    return {
      snackbars,
      snackbarsToShow: snackbars.slice(0, state.snackbarsToShowAtSameTime),
    }
  }),
  snackbarWasPresented: (id: string) => set((state) => {
    const snackbar = state.snackbars.find((s) => s.id === id)

    if (!timeouts.has(id)) {
      snackbar?.snackbarConfig.onShow?.()
      timeouts.set(id, setTimeout(() => {
        state.removeSnackbar(id)
        timeouts.delete(id)
      }, snackbar?.snackbarConfig.timeout || state.defaultTimeoutMs) as unknown as number)
    }

    if (!hasWarned) {
      setImmediate(() => {
        if (timeouts.size === 0) {
          // eslint-disable-next-line no-console
          console.warn('[@kingstinct/react] Snackbar added but not shown, make sure SnackbarView is present (or that you\'re calling snackbarWasPresented if rolling your own).')
          hasWarned = true
        }
      })
    }

    return {}
  }),
}))

export type SnackbarPresentationViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
  readonly colorize?: boolean
}

/**
 * This component should be placed where you want the snackbars to be shown.
 *
 * Do NOT use this component if you're using SnackbarContext!
 */
export const SnackbarPresentationView: React.FC<SnackbarPresentationViewProps> = ({
  Component = DefaultSnackbarComponent,
  isVisibleToUser = true,
  style,
  colorize,
}) => {
  const snackbarWasPresented = useSnackbarWasPresented()
  const snackbarsToShow = useSnackbarsToShow()
  const removeSnackbar = useRemoveSnackbar()

  useEffect(() => {
    if (isVisibleToUser) {
      snackbarsToShow.forEach((snackbar) => snackbarWasPresented(snackbar.id))
    }
  }, [snackbarsToShow, snackbarWasPresented, isVisibleToUser])

  return (
    <View
      pointerEvents='box-none'
      style={[style, { backgroundColor: colorize ? randomHexColorAlpha() : undefined }]}
    >
      { snackbarsToShow.map((i, index) => (
        <Component
          doDismiss={removeSnackbar}
          key={i.id}
          id={i.id}
          snackbarConfig={i.snackbarConfig}
          index={index}
        />
      )) }
    </View>
  )
}

export interface SnackbarSettings {
  /** Default value is 5000 ms */
  readonly defaultTimeoutMs?: number
  /** Default value is 1 */
  readonly snackbarsToShowAtSameTime?: number
}

export const useSnackbarSettings = (settings: SnackbarSettings) => {
  const setDefaultTimeoutMs = useSnackbarStore((state) => state.setDefaultTimeoutMs)
  const setSnackbarsToShowAtSameTime = useSnackbarStore((state) => state.setSnackbarsToShowAtSameTime)

  useEffect(() => {
    if (settings.defaultTimeoutMs != null) setDefaultTimeoutMs(settings.defaultTimeoutMs)
  }, [setDefaultTimeoutMs, settings.defaultTimeoutMs])

  useEffect(() => {
    if (settings.snackbarsToShowAtSameTime != null) setSnackbarsToShowAtSameTime(settings.snackbarsToShowAtSameTime)
  }, [setSnackbarsToShowAtSameTime, settings.snackbarsToShowAtSameTime])
}

export function useAddSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(defaultSnackbarConfig?: Omit<SnackbarConfig<TMap, T>, 'title'>) {
  const addSnackbar = useSnackbarStore((state) => state.addSnackbar)

  return useCallback(function ShowSnackbar<TMapInner extends Record<string, unknown> = TMap, TInner extends keyof TMapInner = keyof TMapInner>(title: string, snackbarConfig?: Omit<SnackbarConfig<TMapInner, TInner>, 'title'>) {
    addSnackbar<TMapInner, TInner>({ ...defaultSnackbarConfig, ...snackbarConfig, title } as SnackbarConfig<TMapInner, TInner>)
  }, [addSnackbar, defaultSnackbarConfig])
}

export const useSnackbarWasPresented = () => useSnackbarStore((state) => state.snackbarWasPresented)

export const useSnackbarsToShow = () => useSnackbarStore((state) => state.snackbarsToShow)

export const useRemoveSnackbar = () => useSnackbarStore((state) => state.removeSnackbar)
