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
      logger.error('Login error:', error)
      showError(`Login error: ${parseError(error)}`)
    },
    onCompleted: (data) => {
      showMessage(`${data.login.username} has logged in!`)
    },
  })

  const login = async (username, password) => {
    const loginResult = await loginMutation({
      variables: { credentials: { username, password } },
    })

    const loginData = loginResult.data?.login
    if (!loginData) {
      return null
    }
    setLoginData(loginData)
    dispatch(logIn(loginData))

    return loginData
  }

  const logout = async () => {
    try {
      await client.resetStore()
      await client.clearStore()
    } catch (e) {
      logger.error('Reset store failed', e)
    }
    localStorage.clear()
    dispatch(logOut())
  }

  return [login, logout, result]
}

export default useLogInOut
