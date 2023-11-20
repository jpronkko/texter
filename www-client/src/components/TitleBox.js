import React from 'react'
import { Box, Typography } from '@mui/material'
import theme from '../theme'

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
        backgroundColor: theme.palette.primary.main,
        borderRadius: 1.5,
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: theme.palette.text.secondary }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default TitleBox
