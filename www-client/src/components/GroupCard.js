import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'

//image="/static/images/cards/contemplative-reptile.jpg"

const GroupCard = ({
  group,
  handleSelectGroup,
  handleManageGroup,
  handleLeaveGroup,
  ownGroup = false,
}) => {
  return (
    <Card sx={{ minWidth: 345 }}>
      <CardActionArea onClick={() => handleSelectGroup(group)}>
        <CardMedia
          component="img"
          height="140"
          image="contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent sx={{ backgroundColor: 'background.default' }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
          >
            {group.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
          >
            Turinaa groupista: {group.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ backgroundColor: 'secondary.light' }}>
        <Button
          size="small"
          color="secondary"
          onClick={() => handleSelectGroup(group)}
        >
          Select
        </Button>
        {ownGroup && (
          <Button
            size="small"
            color="primary"
            onClick={() => handleManageGroup(group)}
          >
            Manage
          </Button>
        )}
        <Button
          size="small"
          color="primary"
          onClick={() => handleLeaveGroup(group)}
        >
          Leave
        </Button>
      </CardActions>
    </Card>
  )
}

export default GroupCard
