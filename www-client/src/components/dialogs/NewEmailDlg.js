import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  password: yup.string().required(),
  email: yup.string().email().required(),
  email_repeat: yup.string().equals([yup.ref('email')], 'E-mails must match'),
})

const EmailDlg = forwardRef((props, ref) => {
  const { handleInput } = props
  const [visible, setVisible] = useState(false)

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      password: '',
      email: '',
      email_repeat: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    console.log('Submiting input:', data)
    handleInput(data)
  }
  const open = () => {
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
    reset() // Clear form fields
  }

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  })

  return (
    <div>
      <Dialog
        open={visible}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Change your e-mail</DialogTitle>
        <DialogContent sx={{ my: 1 }}>
          <FormTextInput
            id="password"
            name="password"
            control={control}
            label="Password"
            type="password"
          />
          <FormTextInput
            id="email"
            name="email"
            control={control}
            label="E-mail"
            type="email"
          />
          <FormTextInput
            id="email_repeat"
            name="email_repeat"
            control={control}
            label="Repeat E-mail"
            type="email"
          />
          <Button
            id="create-button"
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
            sx={{ my: 1 }}
          >
            Change
          </Button>
          <Button
            id="cancel-button"
            onClick={close}
            variant={'outlined'}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
})

EmailDlg.displayName = 'EmailDlg'
export default EmailDlg
