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
    }, 4000)
  }, [message])

  return <>{message ? <Alert>{message}</Alert> : null}</>
}

export default NotifyMessage
