import React from 'react'

import { useDispatch } from 'react-redux'
import { logIn } from '../../app/userSlice'

import LoginForm from '../forms/LoginForm'

import useLogin from '../../hooks/useLogin'

import logger from '../../utils/logger'
import useError from '../../hooks/useErrorMessage'

const Login = () => {
  const [login, ,result] = useLogin()
  const [showError, /*clearError*/] = useError()

  const dispatch = useDispatch()

  const handleLogin = async (data) => {
    logger.info('Login user input data:', data)
    try {
      const token = await login(data.username, data.password)
      logger.info('Login token:', token)
      logger.info('Login result:', result)
      dispatch(logIn({ username: data.username, token }))

    } catch(error) {
      showError(error)
    }
  }

  return (
    <LoginForm handleLogin={handleLogin} />
  )
}

export default Login

