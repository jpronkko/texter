import { useApolloClient, useMutation } from '@apollo/client'

import { LOGIN } from '../graphql/mutations'
import { useDispatch } from 'react-redux'
import { logIn, logOut } from '../app/userSlice'
import logger from '../utils/logger'

const useLogInOut = () => {
  const client = useApolloClient()
  const dispatch = useDispatch()

  const [loginMutation, result] = useMutation(LOGIN, {
    onError: (error) => {
      const err = error.toString()
      console.log('Login error', error)
      if (err.includes('Wrong credentials')) {
        throw new Error('Could not login, check your username and password! ')
      } else {
        throw new Error(`Unknown error ${err}`)
      }
    },
  })

  const login = async (username, password) => {
    logger.info('Login')
    const loginResult = await loginMutation({
      variables: { credentials: { username, password } },
    })

    const loginData = loginResult.data.login

    logger.info('Login: setting login data', loginData)
    localStorage.setItem('texter-login', JSON.stringify(loginData))
    logger.info('Login: setting token', loginData.token)
    localStorage.setItem('texter-token', loginData.token)

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
