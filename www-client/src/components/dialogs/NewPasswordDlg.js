import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle /* Grid */,
} from '@mui/material'
import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  old_password: yup.string().required(),
  new_password: yup
    .string()
    .min(5, ({ min }) => `Password must be at least ${min} characters.`)
    .max(50, ({ max }) => `Password must be no more than ${max} characters.`)
    .required('Password is required'),
  password_repeat: yup
    .string()
    .equals([yup.ref('new_password')], 'Passwords must match'),
})

const PasswordDlg = forwardRef((props, ref) => {
  const { handleInput } = props
  const [visible, setVisible] = useState(false)

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      password_repeat: '',
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
        <DialogTitle id="alert-dialog-title">Change password</DialogTitle>
        <DialogContent sx={{ margin: '5px' }}>
          <FormTextInput
            id="old_password"
            name="old_password"
            control={control}
            label="Old Password"
            type="password"
          />
          <FormTextInput
            id="new_password"
            name="new_password"
            control={control}
            label="New Password"
            type="password"
          />
          <FormTextInput
            id="password_repeat"
            name="password_repeat"
            control={control}
            label="Repeat Password"
            type="password"
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

PasswordDlg.displayName = 'PasswordDlg'
export default PasswordDlg
/*
<Grid
            container
            alignContent="left"
            spacing={1}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
          </Grid> */
