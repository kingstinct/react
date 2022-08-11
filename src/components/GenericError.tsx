import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, {
  useContext,
  useEffect, useMemo, useState,
} from 'react'
import {
  ActivityIndicator, Button, StyleSheet, View,
} from 'react-native'
import { match } from 'ts-pattern'

import StringsContext from '../contexts/Strings'
import useEvent from '../hooks/useEvent'
import useIsOnline from '../hooks/useIsOnline'
import { Text } from '../primitives'

import type { CombinedError } from 'urql'

const styles = StyleSheet.create({
  activityIndicator: { marginTop: 15 },
  container: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: { paddingBottom: 10, textAlign: 'center' },
  icon: { padding: 20 },
})

type OnTryAgain<T = unknown> = (online: boolean) => (Promise<T> | void);

type Props = {
  readonly onTryAgain?: OnTryAgain,
  readonly customMessage?: string
  readonly error: CombinedError | undefined,
}

const GenericError: React.FC<Props> = ({ onTryAgain, customMessage, error }) => {
  const [loading, setLoading] = useState(false),
        isOnline = useIsOnline(),
        strings = useContext(StringsContext),
        [hasBeenOffline, setHasBeenOffline] = useState(false)

  useEffect(() => {
    if (!isOnline && isOnline !== null) {
      setHasBeenOffline(true)
    }
  }, [isOnline])

  const doTryAgain = useEvent(async () => {
    setLoading(true)
    try {
      await onTryAgain?.(!hasBeenOffline && !error?.networkError)
    } finally {
      setLoading(false)
    }
  })

  // eslint-disable-next-line no-nested-ternary
  const message = useMemo(() => (customMessage || match({ error, hasBeenOffline })
    .with({ hasBeenOffline: true }, () => strings['You are offline'])
    .when(({ error }) => !!error?.networkError, () => strings['Network request failed'])
    .otherwise(() => strings['Something went wrong, please try again'])), [customMessage, error, hasBeenOffline])

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={!hasBeenOffline
          ? 'alert'
          : 'lightning-bolt-circle'}
        style={styles.icon}
      />
      <Text style={styles.text}>{ message }</Text>
      { onTryAgain
        ? <Button onPress={doTryAgain} title={strings['Try again']} />
        : null}
      { loading
        ? <ActivityIndicator style={styles.activityIndicator} />
        : null }
    </View>
  )
}

export default GenericError