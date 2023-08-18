import React from 'react'

import { ListItemButton, ListItemText } from '@mui/material'

const MessageListItem = ({ sender, sentTime, body, onClick }) => {
  return(
    <ListItemButton onClick={onClick}>
      <ListItemText primary={sender.name} secondary={sentTime}>
        {body} </ListItemText>
    </ListItemButton>
  )

}

export default MessageListItem