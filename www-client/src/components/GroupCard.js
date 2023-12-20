import * as React from 'react'

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  // CardMedia,
  Typography,
} from '@mui/material'

const GroupCard = ({
  group,
  handleSelectGroup,
  handleManageGroup,
  handleLeaveGroup,
  ownGroup = false,
}) => {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardActionArea onClick={() => handleSelectGroup(group)}>
        {/*  <CardMedia
          component="img"
          height="140"
          image="contemplative-reptile.jpg"
          alt="green iguana"
        /> */}
        <CardContent sx={{ backgroundColor: 'background.default' }}>
          <Typography
            id="group-name"
            gutterBottom
            variant="h6"
            component="div"
          >
            {group.name}
          </Typography>
          <Typography
            id="group-description"
            variant="body2"
            color="text.primary"
          >
            {group.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ backgroundColor: 'secondary.light' }}>
        <Button
          id="select-group-button"
          size="small"
          color="secondary"
          onClick={() => handleSelectGroup(group)}
        >
          Select
        </Button>
        {ownGroup && (
          <Button
            id="manage-group-button"
            size="small"
            color="primary"
            onClick={() => handleManageGroup(group)}
          >
            Manage
          </Button>
        )}
        {!ownGroup && group.name !== 'Common' && (
          <Button
            id="leave-group-button"
            size="small"
            color="primary"
            onClick={() => handleLeaveGroup(group)}
          >
            Leave
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default GroupCard
