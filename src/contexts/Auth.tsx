import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  useEffect, useMemo, useState, createContext, PropsWithChildren,
} from 'react'

type AuthContextData = {
  readonly token: string | null,
  readonly hasToken: boolean,
  readonly clearToken: () => void,
  readonly setToken: (token: string) => void
}

export const AuthContext = createContext<AuthContextData>({
  clearToken: () => { },
  hasToken: false,
  setToken: () => { },
  token: null,
})

const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const t = await AsyncStorage.getItem(AUTH_TOKEN_KEY)

      setToken(t)
    }
    void init()
  }, [])

  const value = useMemo<AuthContextData>(() => ({
    clearToken: () => {
      setToken(null)
      void AsyncStorage.removeItem(AUTH_TOKEN_KEY)
    },
    hasToken: !!token,
    setToken: (t: string) => {
      setToken(t)
      void AsyncStorage.setItem(AUTH_TOKEN_KEY, t)
    },
    token,
  }), [token])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
