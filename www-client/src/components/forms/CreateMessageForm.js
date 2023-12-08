import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { /* Box, */ Button, Grid } from '@mui/material'
//import Grid from '@mui/material/Unstable_Grid2'

import FormTextInput from './FormTextInput'

const schema = yup.object({
  message: yup.string().required(),
})

const CreateMessageForm = ({ handleCreate }) => {
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    handleCreate(data.message)
    reset() // Clear form fields
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{ backgroundColor: 'green', alignItems: 'center' }}
    >
      <Grid
        item
        xs={10.5}
      >
        <FormTextInput
          id="message"
          name="message"
          control={control}
          label="Message"
          multiline={true}
          rows={5}
        />
      </Grid>
      <Grid
        item
        xs={1.5}
      >
        <Button
          id="create-button"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          variant={'contained'}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  )
}

export default CreateMessageForm
