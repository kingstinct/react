import React, {
  useEffect,
} from 'react'
import {
  StyleSheet, View,
} from 'react-native'

import { SnackbarContext } from '../contexts/Snackbar'
import randomHexColorAlpha from '../utils/randomHexColor'
import DefaultSnackbarComponent from './SnackbarComponent'

import type { SnackbarComponentProps } from './SnackbarComponent'
import type {
  StyleProp, ViewStyle,
} from 'react-native'

const styles = StyleSheet.create({
  snackbarPresentationView: {
    justifyContent: 'flex-start', flexDirection: 'column-reverse',
  },
})

type SnackbarPresentationViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
  readonly colorize?: boolean
}

const SnackbarPresentationView: React.FC<SnackbarPresentationViewProps> = ({
  Component = DefaultSnackbarComponent,
  isVisibleToUser = true,
  style,
  colorize,
}) => {
  const { snackbarWasPresented, snackbarsToShow, removeSnackbar } = React.useContext(SnackbarContext)

  useEffect(() => {
    if (isVisibleToUser) {
      snackbarsToShow.forEach((snackbar) => snackbarWasPresented(snackbar.id))
    }
  }, [snackbarsToShow, snackbarWasPresented, isVisibleToUser])

  return (
    <View
      pointerEvents='box-none'
      style={[styles.snackbarPresentationView, style, { backgroundColor: colorize ? randomHexColorAlpha() : undefined }]}
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

export default SnackbarPresentationView
