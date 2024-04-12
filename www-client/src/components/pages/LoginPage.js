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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          margin: '4rem',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            marginTop: '1rem',
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            style={{
              minWidth: '10rem',
              maxWidth: '40rem',
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
    </div>
  )
}

export default Login
