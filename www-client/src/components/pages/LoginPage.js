import React from 'react'
import { useNavigate } from 'react-router-dom'

import useLogInOut from '../../hooks/mutations/useLogInOut'
import LoginForm from '../forms/LoginForm'

const Login = () => {
  const navigate = useNavigate()
  const [login] = useLogInOut()

  const handleLogin = async (credentials) => {
    const user = await login(credentials.username, credentials.password)
    if (user) {
      navigate('/')
    }
  }

  return (
    <div>
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default Login
