import {
  DefaultSnackbarComponent, SnackbarProvider, SnackbarView, useAddSnackbar,
// eslint-disable-next-line import/no-unresolved
} from '@kingstinct/react/contexts/Snackbars'
import { StatusBar } from 'expo-status-bar'
import React, {
  useEffect, useRef,
} from 'react'
import {
  Button, Text, View,
} from 'react-native'

import type { SnackbarComponentProps } from '@kingstinct/react/contexts/Snackbars'

type MyData = {
  readonly 'yo': string
  readonly 'yo2': number
}

const Inner = () => {
  // const { addSnackbar } = useContext(SnackbarContext)
  const addSnackbar = useAddSnackbar<MyData>()
  const counter = useRef(0)
  useEffect(() => {
    const ref = setInterval(() => {
      counter.current += 1
      addSnackbar({
        title: counter.current % 2 === 0 ? `${counter.current} shortie` : `${counter.current} yo a very long sdfgsdfg lhsdf.gl nsd  flghjdslfgjh sdlfgh jsdlkfhjg lsdfjhg lsdjfhg sldfhjg sdlfhgj sdlfjgh sdlfgh`,
        type: 'yo2',
        data: 1,
        actions: [
          {
            label: 'ok',
            onPress: () => {

            },
          },
          {
            label: 'cancel',
            onPress: () => {

            },
          },
        ],
      })
    }, 2000)
    return () => clearInterval(ref)
  }, [])
  return <View>

  </View>
}

const CustomSnackbar: React.FC<SnackbarComponentProps<MyData>> = (props) => <DefaultSnackbarComponent {...props}
  style={{ backgroundColor: 'red' }}
  textStyle={{ color: 'white' }}
  buttonColor='pink' />

export default function App() {
  return (
    <SnackbarProvider>
      <Inner></Inner>
      <View style={{ flex: 1 }}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
      <Button title='Should be pressable' onPress={() => alert('pressed')}></Button>
      <SnackbarView Component={CustomSnackbar} style={{ paddingBottom: 200 }} />
    </SnackbarProvider>
  )
}
