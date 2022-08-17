import React, {
  useEffect,
} from 'react'
import {
  StyleSheet, View,
} from 'react-native'

import { SnackbarContext } from '../contexts/Snackbar'
import DefaultSnackbarComponent from './SnackbarComponent'

import type { SnackbarComponentProps } from './SnackbarComponent'
import type {
  StyleProp, ViewStyle,
} from 'react-native'

const styles = StyleSheet.create({
  snackbarPresentationView: { justifyContent: 'flex-start', flexDirection: 'column-reverse' },
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

type SnackbarPresentationViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
}

const SnackbarPresentationView: React.FC<SnackbarPresentationViewProps> = ({
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
      style={[StyleSheet.absoluteFill, styles.snackbarPresentationView, style]}
    >
      { snackbarsToShow.map((i, index) => <Component
          doDismiss={removeSnackbar}
          key={i.id}
          id={i.id}
          snackbarConfig={i.snackbarConfig} index={index} />) }
    </View>
  )
}

export default SnackbarPresentationView
