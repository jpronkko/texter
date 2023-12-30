import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { setClearMessage } from '../../app/notifySlice'

import { Alert } from '@mui/material'

const NotifyMessage = () => {
  const message = useSelector((state) => state.notify.message)
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(setClearMessage())
    }, 7000)
  }, [message])

  return <>{message ? <Alert id="notify-message">{message}</Alert> : null}</>
}

export default NotifyMessage
