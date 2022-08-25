/* eslint-disable import/no-unresolved */
import DefaultSnackbarComponent from '@kingstinct/react/components/SnackbarComponent'
import SnackbarPresentationView from '@kingstinct/react/components/SnackbarPresentationView'
import { SnackbarProvider } from '@kingstinct/react/contexts/Snackbar'
import useAddSnackbar from '@kingstinct/react/hooks/useAddSnackbar'
import useAlert from '@kingstinct/react/hooks/useAlert'
import useConfirm from '@kingstinct/react/hooks/useConfirm'
import Column from '@kingstinct/react/primitives/Column'
import Row from '@kingstinct/react/primitives/Row'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { Button, Text } from 'react-native'

import type { SnackbarComponentProps } from '@kingstinct/react/components/SnackbarComponent'
import { Switch } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StringsProvider } from '@kingstinct/react/contexts/Strings'

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
      { actions: [{ label: 'ok' }, { label: 'cancel' }] }
    )
  }, [addSnackbar])

  const addVerboseSnackbar = useCallback(() => {
    addSnackbar(
      'This is a very long snackbar title. Ipsum something and other stuff in a long meaningless sentence! asdf asdf asdf asd fasdf asdf asdfa sdfas dfa sdfas fas dfas dfsadfasfd',
      { actions: [{ label: 'ok' }, { label: 'cancel' }] }
    )
  }, [addSnackbar])

  const SnackbarComponent = useCallback(hasCustomSnackbar ? CustomSnackbarComponent : DefaultSnackbarComponent, [hasCustomSnackbar])

  return (
    <SafeAreaProvider>
      <Column fill padding={16} spaceAround>
        <Row  style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Use custom snackbar</Text>
          <Switch onChange={() => setHasCustomSnackbar(v => !v)} value={hasCustomSnackbar} />
        </Row>

        <Button
          title='Add snackbar'
          onPress={() => {
            addSnackbar(
              'Click to add another snackbar',
              { actions: [{ label: 'Short', onPress: addShortSnackbar }, { label: 'Verbose', onPress: addVerboseSnackbar }] }
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
      <SnackbarPresentationView Component={SnackbarComponent} style={{ paddingBottom: 220 }} />
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <SnackbarProvider>
      <StringsProvider strings={{ Cancel: 'Dismiss', OK: 'Sure' }}>
        <StatusBar style='auto' />

        <Body />
      </StringsProvider>
    </SnackbarProvider>
  )
}
