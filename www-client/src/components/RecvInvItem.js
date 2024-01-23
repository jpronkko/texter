import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react'
import useModifyRecvInv from '../hooks/mutations/useModifyRecvInv'

const RecvInvItem = ({ invitation }) => {
  const [acceptInvitation, rejectInvitation] = useModifyRecvInv()

  const handleAccept = async () => {
    await acceptInvitation(invitation.id)
  }

  const handleReject = async () => {
    await rejectInvitation(invitation.id)
  }

  return (
    <Box
      sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(1, lfr)' }}
    >
      <Box>
        <Typography
          variant="subheading"
          color="primary"
        >
          {invitation.group.name} from {invitation.fromUser.username}
        </Typography>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={handleAccept}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          onClick={handleReject}
        >
          Reject
        </Button>
      </Box>
      <Divider />
    </Box>
  )
}

export default RecvInvItem
