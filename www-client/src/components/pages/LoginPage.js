import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'

import useError from '../../hooks/ui/useErrorMessage'
import useLogInOut from '../../hooks/mutations/useLogInOut'

import LoginForm from '../forms/LoginForm'
import logger from '../../utils/logger'

const Login = () => {
  const navigate = useNavigate()
  const [login /*result*/, ,] = useLogInOut()
  const [showError /*clearError*/] = useError()

  const handleLogin = async (credentials) => {
    logger.info('Login user input data:', credentials)

    const user = await login(credentials.username, credentials.password)
    logger.info('Login result:', user)
    if (user) {
      navigate('/')
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
