import React, {
  useCallback, useMemo, useRef, useState,
} from 'react'

import getRandomID from '../utils/getRandomID'

import type { PropsWithChildren } from 'react'

export type Action = {
  readonly key?: string,
  readonly label: string,
  readonly onPress?: (action: Action) => void,
}

export type SnackbarConfig<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> = {
  readonly id?: string, // unique id for the snackbar, to never show duplicates and
  readonly title: string,
  readonly timeout?: number,
  readonly actions?: ReadonlyArray<Action>,
  readonly type?: T,
  readonly data?: TMap[T],
}

type SnackbarWithId = {
  readonly snackbarConfig: SnackbarConfig,
  readonly id: string,
}

const SnackbarContextDefault = {
  snackbarsToShow: [] as readonly SnackbarWithId[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSnackbar: <TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(snackbarConfig: SnackbarConfig<TMap, T>) => {
    console.warn('[@kingstinct/react] SnackbarContext not initialized, please wrap the app in SnackbarProvider')
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeSnackbar: (id: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  snackbarWasPresented: (id: string) => {},
}

export const SnackbarContext = React.createContext(SnackbarContextDefault)

type SnackbarProviderProps = PropsWithChildren<{
  readonly defaultTimeoutMs?: number,
  readonly snackbarsToShowAtSameTime?: number
}>

let hasWarned = false

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  defaultTimeoutMs = 5000,
  snackbarsToShowAtSameTime = 1,
}) => {
  const [snackbars, setSnackbars] = useState<readonly SnackbarWithId[]>([])
  const timeouts = useRef(new Map<string, number>())

  const addSnackbar = useCallback(function addSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(snackbarConfig: SnackbarConfig<TMap, T>) {
    setSnackbars((s) => [
      ...s, {
        snackbarConfig: {
          ...snackbarConfig,
          type: snackbarConfig.type as never, // here is where type safety ends
          data: snackbarConfig.data as never,
        },
        id: snackbarConfig.id || getRandomID(),
      },
    ])
    if (!hasWarned) {
      setImmediate(() => {
        if (timeouts.current.size === 0) {
          console.warn('[@kingstinct/react] Snackbar added but not shown, make sure SnackbarView is present (or that you\'re calling snackbarWasPresented if rolling your own).')
          hasWarned = true
        }
      })
    }
  }, [])

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((snacks) => snacks.filter((s) => s.id !== id))
  }, [])

  const snackbarWasPresented = useCallback((id: string) => {
    const snackbar = snackbars.find((s) => s.id === id)

    if (!timeouts.current.has(id)) {
      timeouts.current.set(id, setTimeout(() => {
        removeSnackbar(id)
        timeouts.current.delete(id)
      }, snackbar?.snackbarConfig.timeout || defaultTimeoutMs) as unknown as number)
    }
  }, [defaultTimeoutMs, removeSnackbar, snackbars])

  return (
    <SnackbarContext.Provider value={useMemo(() => ({
      addSnackbar,
      snackbarWasPresented,
      removeSnackbar,
      snackbarsToShow: snackbars.slice(0, snackbarsToShowAtSameTime),
    }), [
      addSnackbar, removeSnackbar, snackbarWasPresented, snackbars, snackbarsToShowAtSameTime,
    ])}
    >
      {children}
    </SnackbarContext.Provider>
  )
}
