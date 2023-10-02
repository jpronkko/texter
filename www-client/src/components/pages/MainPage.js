import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CssBaseline, Typography } from '@mui/material'

import GroupList from '../GroupList'
import MessageList from './MessageList'

const MainPage = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.userData)
  const topic = useSelector((state) => state.selection.topic)

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    }
  }, [user.username])

  return (
    <div>
      <Typography>Main Page</Typography>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <GroupList />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 2 }}
        >
          {topic?.name ? (
            <MessageList />
          ) : (
            <Typography>No topic selected</Typography>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default MainPage
