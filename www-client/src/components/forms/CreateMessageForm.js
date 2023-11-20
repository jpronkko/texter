import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { /* Box, */ Button, Container } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import FormTextInput from './FormTextInput'

const schema = yup.object({
  message: yup.string().required(),
})

const CreateMessageForm = ({ handleCreate }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    handleCreate(data.message)
  }

  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{ alignItems: 'center' }}
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
    </Container>
  )
}

// <Box sx={{ display: 'flex', margin: '2px', padding: '2px' }}>

// <div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
export default CreateMessageForm
