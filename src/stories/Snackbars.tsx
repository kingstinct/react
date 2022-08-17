/* eslint-disable import/no-unresolved */

import React, {
  useEffect, useRef,
} from 'react'
import {
  Button, Text, View,
} from 'react-native'

import DefaultSnackbarComponent from '../components/SnackbarComponent'
import SnackbarPresentationView from '../components/SnackbarPresentationView'
import { SnackbarProvider } from '../contexts/Snackbar'
import useAddSnackbar from '../hooks/useAddSnackbar'

import type { SnackbarComponentProps } from '../components/SnackbarComponent'

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
      addSnackbar(counter.current % 2 === 0 ? `${counter.current} shortie` : `${counter.current} yo a very long sdfgsdfg lhsdf.gl nsd  flghjdslfgjh sdlfgh jsdlkfhjg lsdfjhg lsdjfhg sldfhjg sdlfhgj sdlfjgh sdlfgh`, {
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

export default function SnackbarsStory() {
  return (
    <SnackbarProvider>
      <Inner></Inner>
      <Button title='Should be pressable' onPress={() => alert('pressed')}></Button>
      <SnackbarPresentationView Component={CustomSnackbar} style={{ paddingBottom: 200 }} />
    </SnackbarProvider>
  )
}
