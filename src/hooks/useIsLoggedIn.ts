import { useContext } from 'react'

import { AuthContext } from '../contexts/Auth'

const useIsLoggedIn = () => {
  const { hasToken } = useContext(AuthContext)

  return hasToken
}

export default useIsLoggedIn
