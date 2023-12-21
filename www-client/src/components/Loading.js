import { Box, LinearProgress, Typography } from '@mui/material'
import React from 'react'

const Loading = () => {
  return (
    <Box sx={{ alignContent: 'center' }}>
      <Typography>Loading...</Typography>
      <LinearProgress />
    </Box>
  )
}

export default Loading
