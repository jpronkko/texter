import React,{ useState, useImperativeHandle, forwardRef } from 'react'
//import { useSelector } from 'react-redux'

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
  input: yup.string().required(),
})

const InputTextDlg = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const { title, handleInput } = props

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      input: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  const onSubmit = (data) => {
    console.log('Submiting input:', data)
    //setTextInput(data.name)
    handleInput(data.input)
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
      close
    }
  })
  return(
    <div>
      <Dialog
        open={visible}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent sx={{ margin: '5px' }}>
          <FormTextInput
            id='input'
            name='input'
            control={control}
            label='Input'
          />
          <Button sx={{ marginLeft: '5px' }} onClick={() => reset()} variant={'outlined'}>x</Button>
        </DialogContent>
        <DialogActions>
          <Button id='create-button' onClick={handleSubmit(onSubmit)} variant={'contained'}>
          Submit
          </Button>

          <Button onClick={close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

InputTextDlg.displayName = 'InputDlg'
/*
<Paper
        style={{
          display: 'grid',
          gridRowGap: '20px',
          padding: '20px',
          margin: '10px 200px',
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <Typography>{message}</Typography>
        <FormTextInput
          id='name'
          name='name'
          control={control}
          label='Name'
        />
        <Button id='create-button' onClick={handleSubmit(onSubmit)} variant={'contained'}>
          Submit
        </Button>
        <Button onClick={() => reset()} variant={'outlined'}>
          Reset
        </Button>
      </Paper>
<Button onClick={handleOk} autoFocus>OK</Button>
          <Button onClick={handleClose}>Cancel</Button>
*/
/*
          <DialogContentText id="alert-dialog-description">


          </DialogContentText>

*/
export default InputTextDlg