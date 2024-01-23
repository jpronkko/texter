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
  const [okObject, setOkObject] = useState({})

  const handleOk = () => {
    setVisible(false)
    if (onOk) {
      onOk(okObject)
    }
  }

  const open = (okObject) => {
    setOkObject(okObject)
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
      >
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="confirm-ok-button"
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
