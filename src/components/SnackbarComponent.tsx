import React, {
  useCallback,
} from 'react'
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import Animated, {
  FadeInUp, FadeOutDown, SequencedTransition,
} from 'react-native-reanimated'

import type { Action, SnackbarConfig } from '../contexts/Snackbar'
import type { PropsWithChildren } from 'react'
import type {
  StyleProp, ViewStyle, ColorValue, TextStyle,
} from 'react-native'

const DEFAULT_BACKGROUND_COLOR = '#323232',
      DEFAULT_BUTTON_TEXT_COLOR = '#B28FF0',
      DEFAULT_TEXT_COLOR = '#CDCDCD'

export const styles = StyleSheet.create({
  buttonText: {
    color: DEFAULT_BUTTON_TEXT_COLOR,
    fontWeight: '500',
    padding: 8,
    paddingLeft: 16,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  snackbar: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 10,
    minHeight: 48,
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
  snackbarText: {
    color: DEFAULT_TEXT_COLOR,
  },
  snackbarButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
})

export type SnackbarComponentProps<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> = {
  readonly snackbarConfig: SnackbarConfig<TMap, T>,
  readonly index: number,
  readonly doDismiss: (snackbarId: string) => void,
  readonly id: string,
}

export type DefaultSnackbarWrapperProps = SnackbarComponentProps & {
  readonly backgroundColor?: ColorValue,
  readonly buttonColor?: ColorValue,
  readonly buttonTextStyle?: StyleProp<TextStyle>,
  readonly style?: StyleProp<ViewStyle>,
  readonly entering?: typeof FadeInUp | null,
  readonly layout?: typeof SequencedTransition | null,
  readonly exiting?: typeof FadeOutDown | null,
}

export type DefaultSnackbarComponentProps = DefaultSnackbarWrapperProps & {
  readonly textColor?: ColorValue,
  readonly textStyle?: StyleProp<TextStyle>,
}

const DEFAULT_ANIMATION_DURATION = 250

const EMPTY_OBJECT = {}

export const DEFAULT_ENTERING = FadeInUp.duration(DEFAULT_ANIMATION_DURATION)
export const DEFAULT_LAYOUT = SequencedTransition.duration(DEFAULT_ANIMATION_DURATION * 2) // 2x duration since it's is over a longer distance
export const DEFAULT_EXITING = FadeOutDown.duration(DEFAULT_ANIMATION_DURATION)

export const DefaultSnackbarComponent: React.FC<DefaultSnackbarComponentProps> = React.memo(({
  snackbarConfig, doDismiss, textStyle, backgroundColor, buttonColor, buttonTextStyle, id, style, entering, layout, exiting, textColor,
}) => {
  const renderButton = useCallback((a: Action, index: number) => (
    <TouchableOpacity
      accessibilityRole='button'
      key={a.key || a.label}
      onPress={() => {
        doDismiss(id)
        a.onPress?.(a)
      }}
    >
      <Text style={[
        styles.buttonText,
        buttonTextStyle,
        buttonColor ? { color: buttonColor } : null,
        index === 0 ? null : { marginLeft: 16 },
      ]}
      >
        {a.label}
      </Text>
    </TouchableOpacity>
  ), [
    buttonColor, buttonTextStyle, doDismiss, id,
  ])

  return (
    <Animated.View
      entering={entering ?? DEFAULT_ENTERING}
      layout={layout ?? DEFAULT_LAYOUT} // 2x duration since it's is over a longer distance
      exiting={exiting ?? DEFAULT_EXITING}
    >

      <View style={[styles.snackbar, style, backgroundColor ? { backgroundColor } : null]}>
        <Text style={[styles.snackbarText, textStyle, textColor ? { color: textColor } : EMPTY_OBJECT]}>{snackbarConfig.title}</Text>
        <View style={styles.snackbarButtonWrapper}>
          { snackbarConfig.actions?.map(renderButton) }
        </View>
      </View>
    </Animated.View>
  )
})

export const DefaultSnackbarWrapper: React.FC<PropsWithChildren<DefaultSnackbarWrapperProps>> = React.memo(({
  snackbarConfig, doDismiss, backgroundColor, buttonColor, buttonTextStyle, id, style, entering, layout, exiting, children,
}) => {
  const renderButton = useCallback((a: Action, index: number) => (
    <TouchableOpacity
      accessibilityRole='button'
      key={a.key || a.label}
      onPress={() => {
        doDismiss(id)
        a.onPress?.(a)
      }}
    >
      <Text style={[
        styles.buttonText,
        buttonTextStyle,
        buttonColor ? { color: buttonColor } : null,
        index === 0 ? null : { marginLeft: 16 },
      ]}
      >
        {a.label}
      </Text>
    </TouchableOpacity>
  ), [
    buttonColor, buttonTextStyle, doDismiss, id,
  ])

  return (
    <Animated.View
      entering={entering ?? DEFAULT_ENTERING}
      layout={layout ?? DEFAULT_LAYOUT} // 2x duration since it's is over a longer distance
      exiting={exiting ?? DEFAULT_EXITING}
    >

      <View style={[styles.snackbar, style, backgroundColor ? { backgroundColor } : null]}>
        { children }
        <View style={styles.snackbarButtonWrapper}>
          { snackbarConfig.actions?.map(renderButton) }
        </View>
      </View>
    </Animated.View>
  )
})

export default DefaultSnackbarComponent
