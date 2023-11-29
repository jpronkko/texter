import React, { useState, useImperativeHandle, forwardRef } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
//import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  name: yup.string().min(3, 'Name must be at least 3 characters').required(),
  description: yup
    .string()
    .min(3, 'Description must be at least 3 characters')
    .required(),
})

const GreateGroupDlg = forwardRef((props, ref) => {
  const { handleInput } = props
  const [visible, setVisible] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    console.log('Submiting input:', data)
    //setTextInput(data.name)
    handleInput(data.name, data.description)
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
        <DialogTitle
          color="primary.contrastText"
          backgroundColor="primary.dark"
          id="alert-dialog-title"
        >
          New group
        </DialogTitle>
        <DialogContent sx={{ margin: '5px' }}>
          <FormTextInput
            id="name"
            name="name"
            control={control}
            label="Group name"
          />
          <FormTextInput
            id="description"
            name="description"
            control={control}
            label="Description"
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="create-button"
            onClick={handleSubmit(onSubmit)}
            variant={'contained'}
          >
            Submit
          </Button>

          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

GreateGroupDlg.displayName = 'InputDlg'

export default GreateGroupDlg
