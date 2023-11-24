import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Paper, Typography } from '@mui/material'

import FormTextInput from './FormTextInput'

const schema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
})

const GroupForm = ({ title, handleFormSubmit }) => {
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    console.log('Submiting create group', data)
    handleFormSubmit(data)
  }

  return (
    <div>
      <Paper
        style={{
          display: 'grid',
          gridRowGap: '20px',
          padding: '20px',
          margin: '10px 200px',
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <FormTextInput
          id="name"
          name="name"
          control={control}
          label="Name"
        />
        <FormTextInput
          id="description"
          name="description"
          control={control}
          label="Description"
        />
        <Button
          id="create-button"
          onClick={handleSubmit(onSubmit)}
          variant={'contained'}
        >
          Submit
        </Button>
        <Button
          onClick={() => reset()}
          variant={'outlined'}
        >
          Reset
        </Button>
      </Paper>
    </div>
  )
}

export default GroupForm
