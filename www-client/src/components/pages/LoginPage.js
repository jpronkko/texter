import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Typography } from '@mui/material'
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
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        margin: '3rem',
        justifyContent: 'center',
      }}
    >
      <div style={{ marginTop: '1rem' }}>
        <Typography
          variant="h4"
          color="primary"
          style={{
            width: '40rem',
            textAlign: 'left',
          }}
        >
          Texter is a simple group messaging app in the vein of Slack or
          Discord.
        </Typography>
        <br />
        <Typography
          variant="h5"
          color="primary"
        >
          Please create an account or log in to continue.
        </Typography>
      </div>
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default Login
