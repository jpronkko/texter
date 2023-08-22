import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Box, Button, /*Grid, Paper,*/ Typography } from '@mui/material'

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
    mode: 'onChange'
  })

  const onSubmit = (data) => {
    handleCreate(data.message)
  }

  return(
    <div>
      <Box sx={{ margin: '2px', padding: '2px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
          <div>
            <Typography variant="h6"> Send message</Typography>
          </div>
          <div>
            <FormTextInput
              id='message'
              name='message'
              control={control}
              label='Message'
            />
            <Button onClick={() => reset()} variant={'outlined'}>
              x
            </Button>
            <Button id='create-button' onClick={handleSubmit(onSubmit)} variant={'contained'}>
              Submit
            </Button>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default CreateMessageForm