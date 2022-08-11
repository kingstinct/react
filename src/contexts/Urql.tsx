import React, {
   useMemo,  createContext, PropsWithChildren, useContext, useState,
} from 'react'
import { CombinedError, Provider, Client } from 'urql'

import { AuthContext } from './Auth'

const DEFAULT_VALUE = {
  reloadClient: () => {},
}

export const UrqlContext = createContext(DEFAULT_VALUE)

type Props = PropsWithChildren<{
  onError: (error: CombinedError) => { },
  createClient: (opts: {
    token: string | null,
    onError: (error: CombinedError) => { },
    clearToken: () => void,
  }) => Client,
}>

const UrqlProvider: React.FC<Props> = ({ children, createClient, onError }) => {
  const { token, clearToken } = useContext(AuthContext)
  const [reloadClientAt, setReloadClientAt] = useState(Date.now())

  const client = useMemo(() => createClient({ token, clearToken, onError }), [
    token, clearToken, onError, createClient,reloadClientAt
  ])

  const value = useMemo(() => ({ 
    reloadClient: () => setReloadClientAt(Date.now())
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
