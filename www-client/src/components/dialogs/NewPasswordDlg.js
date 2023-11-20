import React, { forwardRef, useState, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  name: yup.string().required(),
  password: yup
    .string()
    .min(5, ({ min }) => `Password must be at least ${min} characters.`)
    .max(50, ({ max }) => `Password must be no more than ${max} characters.`)
    .required('Password is required'),
  password_repeat: yup
    .string()
    .equals([yup.ref('password')], 'Passwords must match'),
})

const PasswordDlg = forwardRef((props, ref) => {
  const { handleInput } = props
  const [visible, setVisible] = useState(false)

  const { control, /* reset, */ handleSubmit } = useForm({
    defaultValues: {
      password: '',
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
          <Grid
            container
            alignContent="left"
            spacing={-1}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4"> Change Password</Typography>

            <FormTextInput
              id="password"
              name="password"
              control={control}
              label="Password"
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
            >
              Submit
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
})

PasswordDlg.displayName = 'PasswordDlg'
export default PasswordDlg
