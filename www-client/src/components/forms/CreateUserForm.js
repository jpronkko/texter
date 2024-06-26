import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Divider, Paper, Typography } from '@mui/material'

import FormTextInput from './FormTextInput'
import { useNavigate } from 'react-router-dom'

const schema = yup.object({
  name: yup.string().required(),
  username: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters.`)
    .max(30, ({ max }) => `Username must be no more than ${max} characters.`)
    .required('Username is required'),
  email: yup
    .string()
    .email()
    .required()
    .max(40, ({ max }) => `E-mail must be no more than ${max} characters.`),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters.`)
    .max(50, ({ max }) => `Password must be no more than ${max} characters.`)
    .required('Password is required'),
})

const CreateUserForm = ({ handleCreate }) => {
  const navigate = useNavigate()
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    handleCreate(data)
    reset()
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '20rem',
          gridRowGap: '20px',
          padding: '20px',
          marginTop: '3rem',
          marginLeft: '1rem',
          marginRight: '1rem',
          border: '1px solid #009',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4"> Create a new account</Typography>
        <fieldset
          disabled={isSubmitting}
          style={{ border: 'none' }}
        >
          <FormTextInput
            id="name"
            name="name"
            control={control}
            label="Name"
          />
          <FormTextInput
            id="email"
            name="email"
            control={control}
            label="E-mail"
          />
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
            id="create-submit-button"
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
          >
            {isSubmitting ? 'Creating ...' : 'Create'}
          </Button>
          <Button
            onClick={() => reset()}
            variant={'outlined'}
          >
            Reset
          </Button>
        </fieldset>
        <Divider />
        Already have an account?
        <Button
          variant={'contained'}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Paper>
    </div>
  )
}

export default CreateUserForm

/*       <Grid
        container
        alignContent="center"
        spacing={-1}
        direction="column"
      >
          </Grid>
*/
