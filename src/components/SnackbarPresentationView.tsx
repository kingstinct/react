import React, {
  useEffect,
} from 'react'
import {
  View,
} from 'react-native'

import { SnackbarContext } from '../contexts/Snackbar'
import randomHexColorAlpha from '../utils/randomHexColor'
import DefaultSnackbarComponent from './SnackbarComponent'

import type { SnackbarComponentProps } from './SnackbarComponent'
import type {
  StyleProp, ViewStyle,
} from 'react-native'

export type SnackbarPresentationViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
  readonly colorize?: boolean
}

/**
 * This component should be placed where you want the snackbars to be shown.
 *
 * Do NOT use this component if you're using the hooks from `useSnackbar`,
 * this is to be used with `SnackbarContext`!
 */
export const SnackbarPresentationView: React.FC<SnackbarPresentationViewProps> = ({
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

export default SnackbarPresentationView
