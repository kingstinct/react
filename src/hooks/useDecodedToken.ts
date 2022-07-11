import jwtDecode from 'jwt-decode'
import { useContext } from 'react'

import { AuthContext } from '../contexts/Auth'

const useDecodedToken = () => {
  const { token } = useContext(AuthContext)

  return token ? jwtDecode(token) : null
}

export default useDecodedToken
