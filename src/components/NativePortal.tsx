import { Portal } from '@gorhom/portal'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import type { PropsWithChildren } from 'react'

const NativePortal: React.FC<PropsWithChildren> = ({ children }) => (
  <Portal>
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents='box-none'
    >
      { children }
    </View>
  </Portal>
)
export default NativePortal
