import React from 'react'

import { Box, Divider, /*ListItemButton */ Typography } from '@mui/material'

import { getDateFromString } from '../utils/parsedate'

const MessageListItem = ({ sender, sentTime, body /* onClick */ }) => {
  return (
    <Box sx={{ p: 0.75 }}>
      <Divider>
        {sender.name} {getDateFromString(sentTime)}
      </Divider>
      <Box sx={{ py: 0.25 }}>
        <Typography id="message">{body}</Typography>
      </Box>
    </Box>
  )
}

export default MessageListItem
