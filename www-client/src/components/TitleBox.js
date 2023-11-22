import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

const TitleBox = ({ title, children }) => {
  return (
    <Paper
      elevation={3}
      sx={{ my: 2 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          py: 1,
          my: 2,
          px: 1.5,
          backgroundColor: 'background.drawer', // 'primary.main',
          borderRadius: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mx: 1, color: 'primary.contrastText' }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Paper>
  )
}

export default TitleBox
