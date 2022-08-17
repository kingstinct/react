import React, {
  useCallback,
} from 'react'
import {
  Button, StyleSheet, Text, View,
} from 'react-native'
import Animated, {
  FadeInUp, FadeOutDown, SequencedTransition,
} from 'react-native-reanimated'

import type { Action, SnackbarConfig } from '../contexts/Snackbar'
import type {
  StyleProp, ViewStyle, ColorValue, TextStyle,
} from 'react-native'

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

export type DefaultSnackbarComponentProps = SnackbarComponentProps & {
  readonly buttonColor?: ColorValue,
  readonly textStyle?: StyleProp<TextStyle>,
  readonly style?: StyleProp<ViewStyle>,
  readonly entering?: typeof FadeInUp | null,
  readonly layout?: typeof SequencedTransition | null,
  readonly exiting?: typeof FadeOutDown | null,
}

const DEFAULT_ANIMATION_DURATION = 250

export const DefaultSnackbarComponent: React.FC<DefaultSnackbarComponentProps> = React.memo(({
  snackbarConfig, doDismiss, textStyle, buttonColor, id, style, entering, layout, exiting,
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
    entering={entering ?? FadeInUp.duration(DEFAULT_ANIMATION_DURATION)}
    layout={layout ?? SequencedTransition.duration(DEFAULT_ANIMATION_DURATION * 2)} // 2x duration since it's is over a longer distance
    exiting={exiting ?? FadeOutDown.duration(DEFAULT_ANIMATION_DURATION)}
  >

    <View style={[styles.snackbar, style]}>
      <Text style={textStyle}>{snackbarConfig.title}</Text>
      <View style={styles.snackbarButtonWrapper}>
        { snackbarConfig.actions?.map(renderButton) }
      </View>
    </View>
  </Animated.View>
})

export default DefaultSnackbarComponent
