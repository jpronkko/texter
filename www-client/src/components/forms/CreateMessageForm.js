import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button, Divider } from '@mui/material'

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
      <Divider sx={{ mt: 1, mb: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'inline-block', flexGrow: 6 }}>
          <FormTextInput
            id="message-input"
            name="message"
            control={control}
            label="Message"
            multiline={true}
            rows={5}
          />
        </div>
        <div style={{ display: 'inline-block', margin: '10px' }}>
          <Button
            id="submit-message-button"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateMessageForm
