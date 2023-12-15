import React, { useState, useImperativeHandle, forwardRef } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const ConfirmMessage = forwardRef((props, ref) => {
  const { title, message, onOk } = props
  const [visible, setVisible] = useState(false)

  const handleOk = () => {
    setVisible(false)
    console.log('handleOk', onOk)
    if (onOk) {
      onOk()
    }
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
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleOk}
            autoFocus
            variant="contained"
          >
            OK
          </Button>
          <Button
            onClick={close}
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

ConfirmMessage.displayName = 'ConfirmDlg'

export default ConfirmMessage
