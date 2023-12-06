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
        <Typography>{body}</Typography>
      </Box>
    </Box>
  )
}

export default MessageListItem

/*
<ListItemButton onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'yellow',
            marginBottom: '2px',
            columnGap: '4px',
          }}>
            <Typography variant='h6'>Sender: {sender.name}</Typography>
            <Typography >{dateString}</Typography>
          </div>
          <div style={{ backgroundColor: 'green' }}>
            <Typography>{body}</Typography>
          </div>
        </div>
      </ListItemButton>*/
