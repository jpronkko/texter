import React from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'

const Loading = () => {
  return (
    <Box sx={{ alignContent: 'center', justifyContent: 'center' }}>
      <Typography>Loading...</Typography>
      <LinearProgress />
    </Box>
  )
}

export default Loading
