import React from 'react'

import { ListItemButton, ListItemText } from '@mui/material'

const MessageListItem = ({ sender, text, onClick }) => {
  return(
    <ListItemButton onClick={onClick}>
      <ListItemText primary={sender} secondary="Jan 9, 2014">
        {text} </ListItemText>
    </ListItemButton>
  )

}

export default MessageListItem