import React from 'react'

import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'

const UserListItem = ({ user, onClick }) => {
  return(
    <ListItemButton onClick={onClick}>
      <ListItemAvatar>
        <Avatar src="./coursera.png" alt="logo">
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={user.username} secondary="Jan 9, 2014" />
    </ListItemButton>
  )

}

export default UserListItem