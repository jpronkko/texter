import { useApolloClient, useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'

import { logIn, logOut } from '../../app/userSlice'

import { LOGIN } from '../../graphql/mutations'
import useNotifyMessage from '../ui/useNotifyMessage'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import { setLoginData } from '../../utils/loginData'
import logger from '../../utils/logger'

const useLogInOut = () => {
  const client = useApolloClient()
  const dispatch = useDispatch()
  const [showMessage] = useNotifyMessage()
  const [showError] = useError()

  const [loginMutation, result] = useMutation(LOGIN, {
    onError: (error) => {
      showError(`Login failed: ${parseError(error)}`)
      logger.error('Login error:', error)
    },
    onCompleted: (data) => {
      showMessage(`User ${data.login.username} logged in!`)
      logger.info('Login completed:', data)
    },
  })

  const login = async (username, password) => {
    logger.info('Login')
    const loginResult = await loginMutation({
      variables: { credentials: { username, password } },
    })

    const loginData = loginResult.data?.login
    if (!loginData) {
      logger.error('Login failed')
      return null
    }
    setLoginData(loginData)
    dispatch(logIn(loginData))

    return loginData
  }

  const logout = async () => {
    console.log('apollo reset store')
    try {
      await client.resetStore()
      await client.clearStore()
    } catch (e) {
      console.log('reset store failed', e)
    }
    localStorage.clear()
    dispatch(logOut())
  }

  return [login, logout, result]
}

export default useLogInOut
