import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CssBaseline } from '@mui/material'

import GroupList from '../GroupList'
import MessageList from './MessageList'

const MainPage = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.userData)

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <GroupList />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <MessageList />
        </Box>
      </Box>
    </div>
  )
}

export default MainPage