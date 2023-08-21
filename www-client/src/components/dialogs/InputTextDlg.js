import React from 'react'
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

//import useTextInput from '../../hooks/useTextInput'

import FormTextInput from '../forms/FormTextInput'

const schema = yup.object({
  name: yup.string().required(),
})

const InputTextDlg = ({ title, handleInput, handleClose, isOpen }) => {
  //const title = useSelector(state => state.input.title)

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      input: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  //const [, clearInput, setTextInput] = useTextInput()

  //const isOpen = title !== ''

  const onSubmit = (data) => {
    console.log('Submiting input:', data)
    //setTextInput(data.name)
    handleInput(data.input)
  }

  /*const handleClose = () => {
    clearInput()
  }*/

  return(
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
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
            label='Name'
          />
          <Button sx={{ marginLeft: '5px' }} onClick={() => reset()} variant={'outlined'}>x</Button>
        </DialogContent>
        <DialogActions>
          <Button id='create-button' onClick={handleSubmit(onSubmit)} variant={'contained'}>
          Submit
          </Button>

          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
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