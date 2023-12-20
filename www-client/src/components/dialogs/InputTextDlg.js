import React, { useState, useImperativeHandle, forwardRef } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@mui/material'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  input: yup.string().required(),
})

const InputTextDlg = forwardRef((props, ref) => {
  const { title, label, handleInput } = props
  const [visible, setVisible] = useState(false)

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      input: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    handleInput(data.input)
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
        <DialogTitle
          color="primary.contrastText"
          backgroundColor="primary.dark"
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent sx={{ m: 1, mt: 2, pb: 0.5 }}>
          <FormTextInput
            id="input"
            name="input"
            control={control}
            label={label}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="submit-button"
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            onClick={close}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

InputTextDlg.displayName = 'InputDlg'

export default InputTextDlg
