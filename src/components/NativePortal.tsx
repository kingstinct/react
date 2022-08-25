import { Portal } from '@gorhom/portal'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import type { PropsWithChildren } from 'react'
import type { ViewProps, Insets } from 'react-native'

type Props = PropsWithChildren<{ readonly pointerEvents?: ViewProps['pointerEvents'], readonly insets?: Insets }>

const NativePortal: React.FC<Props> = ({ children, pointerEvents = 'box-none', insets }) => (
  <Portal>
    <View
      pointerEvents={pointerEvents}
      style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }, insets]}>
      { children }
    </View>

  </Portal>
)
export default NativePortal
