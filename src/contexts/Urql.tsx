import React, {
  useMemo, createContext, useContext, useState,
} from 'react'
import { Provider } from 'urql'

import { AuthContext } from './Auth'

import type { PropsWithChildren } from 'react'
import type { CombinedError, Client } from 'urql'

const DEFAULT_VALUE = {
  reloadClient: () => {},
}

export const UrqlContext = createContext(DEFAULT_VALUE)

type Props = PropsWithChildren<{
  readonly onError: (error: CombinedError) => void,
  readonly createClient: (opts: {
    readonly token: string | null,
    readonly onError: (error: CombinedError) => void,
    readonly clearToken: () => void,
  }) => Client,
}>

const UrqlProvider: React.FC<Props> = ({ children, createClient, onError }) => {
  const { token, clearToken } = useContext(AuthContext)
  const [reloadClientAt, setReloadClientAt] = useState(Date.now())

  const client = useMemo(() => createClient({ token, clearToken, onError }), [
    token, clearToken, onError, createClient, reloadClientAt,
  ])

  const value = useMemo(() => ({
    reloadClient: () => setReloadClientAt(Date.now()),
  }), [])

  return (
    <UrqlContext.Provider value={value}>
      <Provider value={client}>
        {children}
      </Provider>
    </UrqlContext.Provider>
  )
}

export default UrqlProvider
