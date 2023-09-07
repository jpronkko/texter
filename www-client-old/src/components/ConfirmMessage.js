import React from 'react'

import { useSelector } from 'react-redux'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import useConfirmMessage from '../hooks/useConfirmMessage'

const ConfirmMessage = () => {
  const title = useSelector(state => state.confirm.title)
  const message = useSelector(state => state.confirm.message)
  const callback = useSelector(state => state.confirm.callback)

  const [, clearMessage] = useConfirmMessage()

  const handleOk = () => {
    clearMessage()
    if(callback)
      callback()
  }

  const handleClose = () => {
    clearMessage()
  }

  const isOpen = message !== undefined && message !== ''

  return (
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
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} autoFocus>OK</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmMessage