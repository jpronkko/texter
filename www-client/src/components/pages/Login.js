import React from 'react'


import LoginForm from '../forms/LoginForm'

import useLogInOut from '../../hooks/useLogInOut'

import logger from '../../utils/logger'
import useError from '../../hooks/useErrorMessage'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [login, ,/*result*/] = useLogInOut()
  const [showError, /*clearError*/] = useError()

  const handleLogin = async (credentials) => {
    logger.info('Login user input data:', credentials)
    try {
      const user = await login(
        credentials.username,
        credentials.password
      )
      logger.info('Login result:', user)
      navigate('/')
    } catch(error) {
      showError(error)
    }
  }

  return (
    <LoginForm handleLogin={handleLogin} />
  )
}

export default Login

