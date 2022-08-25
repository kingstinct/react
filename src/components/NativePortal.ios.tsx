import { Portal } from '@gorhom/portal'
import React from 'react'
import { StyleSheet } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import type { PropsWithChildren } from 'react'
import type { ViewProps, Insets } from 'react-native'

type Props = PropsWithChildren<{ readonly pointerEvents?: ViewProps['pointerEvents'], readonly insets: Insets }>

const NativePortal: React.FC<Props> = ({ children, pointerEvents, insets }) => (
  <Portal>
    <FullWindowOverlay
      pointerEvents={pointerEvents}
      style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }, insets]}>
      { children }
    </FullWindowOverlay>
  </Portal>
)
export default NativePortal
