import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CssBaseline, Typography } from '@mui/material'

import GroupList from '../GroupList'
import MessageList from './MessageList'

const MainPage = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.userData)
  const topicName = useSelector(state => state.selection.topicName)

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    }
  }, [user.username])

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <GroupList />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          {topicName ? <MessageList /> : <Typography>No topic selected</Typography>}
        </Box>
      </Box>
    </div>
  )
}

export default MainPage