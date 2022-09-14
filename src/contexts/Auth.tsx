import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  useEffect, useMemo, useState, createContext, useContext,
} from 'react'

import type { PropsWithChildren } from 'react'

export enum Status {
  INITIALIZING,
  READY_WITH_TOKEN,
  READY_WITHOUT_TOKEN,
}

type AuthContextData = {
  readonly token: string | null,
  readonly hasToken: boolean,
  readonly clearToken: () => void,
  readonly setToken: (token: string) => void
  readonly status: Status
}

export const AuthContext = createContext<AuthContextData>({
  clearToken: () => { },
  hasToken: false,
  setToken: () => { },
  token: null,
  status: Status.INITIALIZING,
})

const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

type AuthStateInternal = { readonly token: string | null, readonly isReady: boolean }

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [{ token, isReady }, setToken] = useState<AuthStateInternal>({ token: null, isReady: false })

  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem(AUTH_TOKEN_KEY)

      setToken({ token: t, isReady: true })
    }
    void init()
  }, [])

  const value = useMemo<AuthContextData>(() => ({
    clearToken: () => {
      setToken({ token: null, isReady: true })
      void AsyncStorage.removeItem(AUTH_TOKEN_KEY)
    },
    hasToken: !!token,
    setToken: (t: string) => {
      setToken({ token: t, isReady: true })
      void AsyncStorage.setItem(AUTH_TOKEN_KEY, t)
    },
    token,
    status: isReady ? (token ? Status.READY_WITH_TOKEN : Status.READY_WITHOUT_TOKEN) : Status.INITIALIZING,
  }), [token, isReady])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useToken = () => {
  const { token } = useContext(AuthContext)

  return token
}

export const useStatus = () => {
  const { status } = useContext(AuthContext)

  return status
}

export const useSetToken = () => {
  const { setToken } = useContext(AuthContext)

  return setToken
}

export const useClearToken = () => {
  const { clearToken } = useContext(AuthContext)

  return clearToken
}

export default AuthProvider
