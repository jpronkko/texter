import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, Paper, Typography } from '@mui/material'

import FormTextInput from './FormTextInput'

const CreateUserForm = ({ handleCreate }) => {
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
    mode: 'onChange'
  })

  const onSubmit = (data) => {
    console.log(data)
    handleCreate(data)
  }

  return(
    <div>
      <Paper
        style={{
          display: 'grid',
          gridRowGap: '20px',
          padding: '20px',
          margin: '10px 300px',
        }}
      >
        <Typography variant="h4"> Create new account</Typography>
        <FormTextInput
          name='name'
          control={control}
          label='Name'
        />
        <FormTextInput
          name='email'
          control={control}
          label='E-mail'
        />
        <FormTextInput
          name='username'
          control={control}
          label='Username'
        />
        <FormTextInput
          name='password'
          control={control}
          label='Password'
          type='password'
        />
        <Button onClick={handleSubmit(onSubmit)} variant={'contained'}>
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