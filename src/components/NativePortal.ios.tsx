import { Portal } from '@gorhom/portal'
import React from 'react'
import { StyleSheet } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import type { PropsWithChildren } from 'react'

const NativePortal: React.FC<PropsWithChildren> = ({ children }) => (
  <Portal>
    <FullWindowOverlay
      style={[StyleSheet.absoluteFill]}
      pointerEvents='box-none'
    >
      { children }
    </FullWindowOverlay>
  </Portal>
)
export default NativePortal
