import React from 'react'

import LoginForm from '../forms/LoginForm'

import useLogInOut from '../../hooks/useLogInOut'

import logger from '../../utils/logger'
import useError from '../../hooks/useErrorMessage'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

const Login = () => {
  const navigate = useNavigate()
  const [login /*result*/, ,] = useLogInOut()
  const [showError /*clearError*/] = useError()

  const handleLogin = async (credentials) => {
    logger.info('Login user input data:', credentials)
    try {
      const user = await login(credentials.username, credentials.password)
      logger.info('Login result:', user)
      navigate('/')
    } catch (error) {
      showError(error.toString())
    }
  }

  const fastLogin = async (username, password) => {
    try {
      await login(username, password)
      navigate('/')
    } catch (error) {
      showError(error.toString())
    }
  }
  return (
    <div>
      <Button onClick={() => fastLogin('anni', 'klonksahtava')}>Anni</Button>
      <Button onClick={() => fastLogin('sonja', 'eyeofsauron')}>Sonja</Button>
      <Button onClick={() => fastLogin('raikku', 'hilpatihalpati')}>
        Raimo
      </Button>
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default Login
