import React, {
  useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import {
  Button, StyleSheet, Text, View,
} from 'react-native'
import Animated, {
  FadeInUp, FadeOutDown, SequencedTransition,
} from 'react-native-reanimated'

import getRandomID from '../utils/getRandomID'

import type { PropsWithChildren } from 'react'
import type {
  StyleProp, ViewStyle, ColorValue, TextStyle,
} from 'react-native'

export type Action = {
  readonly key?: string,
  readonly label: string,
  readonly onPress?: (action: Action) => void,
}

const MySnackbarTypes = {
  hello: { data: 'yo' },
}

type SnackbarConfig<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> = {
  readonly id?: string, // unique id for the snackbar, to never show duplicates and
  readonly title: string,
  readonly timeout?: number,
  readonly actions?: ReadonlyArray<Action>,
  readonly type?: T,
  readonly data?: TMap[T],
}

type SnackbarWithStatus = {
  readonly snackbarConfig: SnackbarConfig,
  readonly id: string,
}

const SnackbarContextDefault = {
  snackbarsToShow: [] as readonly SnackbarWithStatus[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSnackbar: <TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(snackbarConfig: SnackbarConfig<TMap, T>) => {},
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

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  snackbarButtonWrapper: {
    flexDirection: 'row', justifyContent: 'flex-end', flexGrow: 1,
  },
})

export type SnackbarComponentProps<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> = {
  readonly snackbarConfig: SnackbarConfig<TMap, T>,
  readonly index: number,
  readonly doDismiss: (snackbarId: string) => void,
  readonly id: string,
}

export type DefaultSnackbarComponentProps = SnackbarComponentProps & {
  readonly buttonColor?: ColorValue,
  readonly textStyle?: StyleProp<TextStyle>,
  readonly style?: StyleProp<ViewStyle>,
}

export const DefaultSnackbarComponent: React.FC<DefaultSnackbarComponentProps> = React.memo(({
  snackbarConfig, doDismiss, textStyle, buttonColor, id, style,
}) => {
  const renderButton = useCallback((a: Action) => <Button
      key={a.key || a.label}
      color={buttonColor}
      onPress={() => {
        doDismiss(id)
        a.onPress?.(a)
      }}
      title={a.label}
  ></Button>, [id])

  return <Animated.View
entering={FadeInUp.duration(100)}
layout={SequencedTransition.duration(300)}
exiting={FadeOutDown.duration(100)}>

    <View style={[styles.snackbar, style]}>
      <Text style={textStyle}>{snackbarConfig.title}</Text>
      <View style={styles.snackbarButtonWrapper}>
        { snackbarConfig.actions?.map(renderButton) }
      </View>
    </View>
  </Animated.View>
})

let hasWarned = false

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  defaultTimeoutMs = 5000,
  snackbarsToShowAtSameTime = 1,
}) => {
  const [snackbars, setSnackbars] = useState<readonly SnackbarWithStatus[]>([])
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

type SnackbarViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
}

export function useAddSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(defaultSnackbarConfig?: SnackbarConfig<TMap, T>) {
  const { addSnackbar } = useContext(SnackbarContext)
  return useCallback(function ShowSnackbar<TMapInner extends Record<string, unknown> = TMap, TInner extends keyof TMapInner = keyof TMapInner>(snackbarConfig: SnackbarConfig<TMapInner, TInner>) {
    addSnackbar<TMapInner, TInner>({ ...defaultSnackbarConfig, ...snackbarConfig } as SnackbarConfig<TMapInner, TInner>)
  }, [])
}

export const SnackbarView: React.FC<SnackbarViewProps> = ({
  Component = DefaultSnackbarComponent, style, isVisibleToUser = true,
}) => {
  const { snackbarWasPresented, snackbarsToShow, removeSnackbar } = React.useContext(SnackbarContext)

  useEffect(() => {
    if (isVisibleToUser) {
      snackbarsToShow.forEach((snackbar) => snackbarWasPresented(snackbar.id))
    }
  }, [snackbarsToShow, snackbarWasPresented])

  return (
    <View
      pointerEvents='box-none'
      style={[StyleSheet.absoluteFill, { justifyContent: 'flex-start', flexDirection: 'column-reverse' }, style]}
    >
      { snackbarsToShow.map((i, index) => <Component
          doDismiss={removeSnackbar} key={i.id} id={i.id} snackbarConfig={i.snackbarConfig} index={index} />) }

    </View>
  )
}

// type SnackbarViewProps = {
//   readonly renderItem: (snackbarConfig: SnackbarConfig, index: number) => React.ReactNode,
//   readonly entryAnimation?: AnimateProps<object>['entering'],
//   readonly exitAnimation?: AnimateProps<object>['exiting'],
// }
// export const SnackbarView: React.FC<SnackbarViewProps> = ({
//   renderItem, entryAnimation = SlideInDown.duration(1000), exitAnimation = SlideOutUp.duration(1000), Component,
// }) => {
//   const { snackbarWasPresented, snackbarsToShow } = React.useContext(SnackbarContext)

//   useEffect(() => {
//     snackbarsToShow.forEach((snackbar) => snackbarWasPresented(snackbar.id))
//   }, [snackbarsToShow, snackbarWasPresented])

//   console.log('snackbarsToShow', snackbarsToShow)

//   return (
//     <View
//       pointerEvents='box-none'
//       style={[{ flexDirection: 'column-reverse' }, StyleSheet.absoluteFill]}
//     >
//       { snackbarsToShow.map((i, index) => <Animated.View
//         entering={entryAnimation}
//         exiting={exitAnimation}
//         style={{ height: 100 }}
//         key={i.id}>{ renderItem(i.snackbarConfig, index) }</Animated.View>) }
//     </View>
//   )
// }
