import { useApolloClient, useMutation } from '@apollo/client'

import { LOGIN } from '../graphql/mutations'
import { useDispatch } from 'react-redux'
import { logIn, logOut } from '../app/userSlice'
import logger from '../utils/logger'

const useLogInOut = () => {
  const client = useApolloClient()
  const dispatch = useDispatch()

  const [loginMutation, result] = useMutation( LOGIN,
    {
      onError: (error) => {
        const err = error.toString()
        console.log('error', error)
        if(err.includes('Wrong credentials')) {
          throw new Error('Could not login, check your username and password! ')
        } else {
          throw new Error('Unknown error, check your network connection and try again.')
        }
      }
    }
  )

  const login = async (username, password) => {
    const loginResult = await loginMutation({ variables:
      { credentials: { username, password } } })

    const loginData = loginResult.data.login

    logger.info('Login data', loginData)
    localStorage.setItem('texter', loginData)
    dispatch(logIn(loginData))
    return loginData
  }

  const logout = async () => {
    localStorage.clear()
    client.resetStore()
    dispatch(logOut())
  }

  return [login, logout, result]
}

export default useLogInOut