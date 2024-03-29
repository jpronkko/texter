import React from 'react'
import { useSelector } from 'react-redux'

import useError from '../../hooks/ui/useErrorMessage'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const ErrorDlg = () => {
  const errorMessage = useSelector((state) => state.error.message)

  const [, clearError] = useError()
  const handleClose = () => {
    clearError()
  }

  const isOpen = errorMessage !== undefined && errorMessage !== ''

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          color="primary.contrastText"
          backgroundColor="error.dark"
          id="alert-dialog-title"
        >
          {'Error!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            color="text.error"
            id="error-dialog-message"
          >
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            id="error-dialog-ok-button"
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ErrorDlg
