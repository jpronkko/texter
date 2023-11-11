import React from 'react'

import { List, ListItemText, Typography } from '@mui/material'

const UserListItem = ({ key, user }) => {
  return (
    <ListItemText
      sx={{ pl: 2 }}
      key={key}
      primary={user.username}
      secondary={
        <>
          <Typography>id: {user.id}</Typography>
          <Typography>e-mail: {user.email}</Typography>
          <Typography>Joined Groups:</Typography>
          <List
            component="div"
            disablePadding
            dense
          >
            {user.joinedGroups.map((group) => (
              <ListItemText
                sx={{ pl: 2 }}
                key={group.groupId}
                primary={group.groupName}
                secondary={
                  <>
                    <Typography variant="body2">id: {group.groupId}</Typography>
                    <Typography variant="body2">role: {group.role}</Typography>
                  </>
                }
              />
            ))}
          </List>
        </>
      }
    />
  )
}

export default UserListItem
