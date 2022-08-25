/* eslint-disable import/no-unresolved */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { Switch } from 'react-native-paper'
import Animated, { FadeInUp, SequencedTransition } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import DefaultSnackbarComponent from '../components/SnackbarComponent'
import SnackbarPresentationView from '../components/SnackbarPresentationView'
import { SharedPortalAreaProvider, SharedPortalPresentationArea } from '../contexts/SharedPortalArea'
import { SnackbarProvider } from '../contexts/Snackbar'
import { StringsProvider } from '../contexts/Strings'
import useAddSnackbar from '../hooks/useAddSnackbar'
import useAlert from '../hooks/useAlert'
import useConfirm from '../hooks/useConfirm'
import Column from '../primitives/Column'
import Row from '../primitives/Row'

import type { SnackbarComponentProps } from '../components/SnackbarComponent'

const Stack = createNativeStackNavigator()

const CustomSnackbarComponent: React.FC<SnackbarComponentProps> = (props) => (
  <DefaultSnackbarComponent
    {...props}
    backgroundColor='#333'
    textStyle={{ color: 'white' }}
    buttonColor='pink'
  />
)

const Body: React.FC = () => {
  const [hasCustomSnackbar, setHasCustomSnackbar] = useState(false)
  const [confirmationDialogResponse, setConfirmationDialogResponse] = useState<boolean>()
  const addSnackbar = useAddSnackbar()
  const alert = useAlert()
  const confirm = useConfirm()

  const addShortSnackbar = useCallback(() => {
    addSnackbar(
      'This is a short snackbar title',
      { actions: [{ label: 'ok' }, { label: 'cancel' }] },
    )
  }, [addSnackbar])

  const addVerboseSnackbar = useCallback(() => {
    addSnackbar(
      'This is a very long snackbar title. Ipsum something and other stuff in a long meaningless sentence! asdf asdf asdf asd fasdf asdf asdfa sdfas dfa sdfas fas dfas dfsadfasfd',
      { actions: [{ label: 'ok' }, { label: 'cancel' }] },
    )
  }, [addSnackbar])

  const SnackbarComponent = useCallback(hasCustomSnackbar ? CustomSnackbarComponent : DefaultSnackbarComponent, [hasCustomSnackbar])

  console.log('App')

  return (
    <SafeAreaProvider>
      <Column fill padding={16} spaceAround>
        <Row style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Use custom snackbar</Text>
          <Switch onChange={() => setHasCustomSnackbar((v) => !v)} value={hasCustomSnackbar} />
        </Row>

        <Button
          title='Add snackbar'
          onPress={() => {
            addSnackbar(
              'Click to add another snackbar',
              { actions: [{ label: 'Short', onPress: addShortSnackbar }, { label: 'Verbose', onPress: addVerboseSnackbar }] },
            )
          }}
        />

        <Button
          title='Show alert dialog'
          onPress={() => void alert('This is an alert dialog', 'This is the message')}
        />

        <Button
          title='Show confirmation dialog'
          onPress={async () => setConfirmationDialogResponse(await confirm('This is a confirmation dialog', 'This is the message'))}
        />

        <Text>Response from confirmation dialog: {confirmationDialogResponse?.toString()}</Text>
      </Column>
      <SharedPortalPresentationArea>
        <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
        <SnackbarPresentationView Component={SnackbarComponent} />
        <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>
      </SharedPortalPresentationArea>
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <SnackbarProvider>
      <SharedPortalAreaProvider>
        <StringsProvider strings={{ Cancel: 'Dismiss', OK: 'Sure' }}>
          <StatusBar style='auto' />
          <Stack.Navigator>
            <Stack.Screen name='Body' component={Body} />
          </Stack.Navigator>
        </StringsProvider>
      </SharedPortalAreaProvider>
    </SnackbarProvider>
  )
}
