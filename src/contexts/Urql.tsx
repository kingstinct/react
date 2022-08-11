import React, {
  useMemo, createContext, useContext, useState,
} from 'react'
import { Provider } from 'urql'

import { AuthContext } from './Auth'

import type { GraphQLError } from 'graphql'
import type { PropsWithChildren } from 'react'
import type { CombinedError, Client, Operation } from 'urql'

const DEFAULT_VALUE = {
  reloadClient: () => {},
}

export const UrqlContext = createContext(DEFAULT_VALUE)

export type CreateUrqlClient<T extends Record<string, string>> = (opts: {
  readonly token: string | null,
  readonly onError: (error: CombinedErrorWithExtensions<T>, operation: Operation) => void,
  readonly clearToken: () => void,
}) => Client

type Props<T extends Record<string, string>> = PropsWithChildren<{
  readonly onError: (error: CombinedErrorWithExtensions<T>, operation: Operation) => void,
  readonly createClient: CreateUrqlClient<T>,
}>

type CustomGraphQLError<T extends Record<string, string> = Record<string, string>> = Omit<GraphQLError, 'extensions'> & {
  readonly extensions: T
}

type CombinedErrorWithExtensions<T extends Record<string, string> = Record<string, string>> = Omit<CombinedError, 'graphQLErrors'> & {
  readonly graphQLErrors: readonly CustomGraphQLError<T>[];
}

function UrqlProvider<T extends Record<string, string>>({ children, createClient, onError }: Props<T>) {
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
