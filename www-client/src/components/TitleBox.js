import React from 'react'
import { Box, Typography } from '@mui/material'

const TitleBox = ({ title, children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        py: 1,
        my: 2,
        px: 1.5,
        backgroundColor: 'primary.main',
        borderRadius: 1.5,
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: 'primary.contrastText' }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default TitleBox
