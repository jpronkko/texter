import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Divider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'

import FormTextInput from './FormTextInput'
import { useNavigate } from 'react-router-dom'

const schema = yup.object({
  username: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters.`)
    .max(30, ({ max }) => `Username must be no more than ${max} characters.`)
    .required('Username is required'),
  password: yup
    .string()
    .min(5, ({ min }) => `Password must be at least ${min} characters.`)
    .max(50, ({ max }) => `Password must be no more than ${max} characters.`)
    .required('Password is required'),
})

const LoginForm = ({ handleLogin }) => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    handleLogin(data)
  }

  return (
    <div>
      <Grid
        container
        alignContent="center"
        spacing={-1}
        direction="column"
      >
        <Paper
          elevation={3}
          style={{
            display: 'grid',
            width: '400px',
            gridRowGap: '20px',
            padding: '20px',
            margin: '10px 10px',
          }}
        >
          <Typography variant="h5"> Sign in</Typography>
          <fieldset disabled={isSubmitting}>
            <FormTextInput
              id="username"
              name="username"
              control={control}
              label="Username"
            />
            <FormTextInput
              id="password"
              testId="password"
              name="password"
              control={control}
              label="Password"
              type="password"
            />
            <Button
              id="login-button"
              sx={{ marginTop: '10px' }}
              onClick={handleSubmit(onSubmit)}
              variant={'contained'}
            >
              {isSubmitting ? 'Logging in ...' : 'Login'}
            </Button>

            <Divider sx={{ margin: '10px' }} />

            <Typography>Do not have an account?</Typography>
            <Button
              id="create-new-button"
              variant={'contained'}
              sx={{ marginTop: '10px' }}
              onClick={() => navigate('/create_account')}
            >
              Create a New Account
            </Button>
          </fieldset>
        </Paper>
      </Grid>
    </div>
  )
}

export default LoginForm
