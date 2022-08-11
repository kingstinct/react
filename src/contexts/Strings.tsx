import React, { createContext, useMemo } from 'react'

import type { PropsWithChildren } from 'react'

const DEFAULT_VALUE = {
  'Try again': 'Try again',
  'You are offline': 'You are offline',
  'Network request failed': 'Network request failed',
  'Something went wrong, please try again': 'Something went wrong, please try again',
}

const StringsContext = createContext(DEFAULT_VALUE)

export const StringsProvider: React.FC<PropsWithChildren & { readonly strings: Partial<typeof DEFAULT_VALUE> }> = ({ children, strings }) => <StringsContext.Provider value={useMemo(() => ({
  ...DEFAULT_VALUE,
  ...strings,
}), [])}>
  {children}
</StringsContext.Provider>

export default StringsContext