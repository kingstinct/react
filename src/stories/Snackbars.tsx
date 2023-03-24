/* eslint-disable import/no-unresolved */

import React, { useEffect, useRef, useState } from 'react'
import { Button, Text, View } from 'react-native'

import { SnackbarPresentationView } from '../components'
import { DefaultSnackbarComponent } from '../components/SnackbarComponent'
import useAddSnackbar from '../hooks/useAddSnackbar'
import useAlert from '../hooks/useAlert'
import useConfirm from '../hooks/useConfirm'

import type { SnackbarComponentProps } from '../components/SnackbarComponent'

type MyData = {
  readonly 'yo': string
  readonly 'yo2': number
}

const Inner = () => {
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
  }, [addSnackbar])

  return (
    <View />
  )
}

const CustomSnackbar: React.FC<SnackbarComponentProps<MyData>> = (props) => (
  <DefaultSnackbarComponent
    {...props}
    style={{ backgroundColor: 'red' }}
    textStyle={{ color: 'white' }}
    buttonColor='pink'
  />
)

export default function SnackbarsStory() {
  const alert = useAlert()
  const confirm = useConfirm()
  const [confirmResponse, setConfirmResponse] = useState<boolean>()

  return (
    <View>
      <Inner />
      <Button title='Open an alert' onPress={async () => alert('This is an alert', 'This is the message')} />

      <View style={{ height: 16 }} />

      <Button title='Open a confirmation dialog' onPress={async () => setConfirmResponse(await confirm('This is a confirmation dialog', 'This is the message'))} />
      <Text>
        Response from confirmation dialog:
        {confirmResponse}
      </Text>

      <SnackbarPresentationView Component={CustomSnackbar} style={{ paddingBottom: 200 }} />
    </View>
  )
}
