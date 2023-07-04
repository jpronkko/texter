import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Paper, Typography } from '@mui/material'

import FormTextInput from './FormTextInput'

const schema = yup.object({
  name: yup.string().required(),
  username: yup
    .string()
    .min(4, ({ min }) => `Username must be at least ${min} characters.`)
    .max(30, ({ max }) => `Username must be no more than ${max} characters.`)
    .required('Username is required'),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(5, ({ min }) => `Password must be at least ${min} characters.`)
    .max(50, ({ max }) => `Password must be no more than ${max} characters.`)
    .required('Password is required'),
})

const CreateUserForm = ({ handleCreate }) => {
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  const onSubmit = (data) => {
    handleCreate(data)
  }

  return(
    <div>
      <Paper
        style={{
          display: 'grid',
          gridRowGap: '20px',
          padding: '20px',
          margin: '10px 200px',
        }}
      >
        <Typography variant="h4"> Create new account</Typography>
        <FormTextInput
          id='name'
          name='name'
          control={control}
          label='Name'
        />
        <FormTextInput
          id='email'
          name='email'
          control={control}
          label='E-mail'
        />
        <FormTextInput
          id='username'
          name='username'
          control={control}
          label='Username'
        />
        <FormTextInput
          id='password'
          testId='password'
          name='password'
          control={control}
          label='Password'
          type='password'
        />
        <Button id='create-button' onClick={handleSubmit(onSubmit)} variant={'contained'}>
          Submit
        </Button>
        <Button onClick={() => reset()} variant={'outlined'}>
          Reset
        </Button>
      </Paper>
    </div>
  )
}

export default CreateUserForm