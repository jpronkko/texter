import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Grid, Divider } from '@mui/material'

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
    <div>
      <Divider />
      <Grid
        container
        spacing={1}
        sx={{ my: 1, alignItems: 'center' }}
      >
        <Grid
          item
          xs={11.0}
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
          xs={1.0}
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
    </div>
  )
}

export default CreateMessageForm
