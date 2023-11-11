import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import useSentInvitations from '../hooks/useSentInvitations'
import useRecvInvitations from '../hooks/useRecvInvitations'
import useModifyInvitations from '../hooks/useModifyInvitations'

const RecvInvItem = ({ invitation }) => {
  const [acceptInvitation, rejectInvitation] = useModifyInvitations()

  const handleAccept = async () => {
    const retval = await acceptInvitation(invitation.id)
    console.log('retval', retval)
  }

  const handleReject = () => {
    rejectInvitation(invitation.id)
  }

  return (
    <MenuItem>
      <Typography>
        {invitation.user.name} invited you to join {invitation.group.name}
      </Typography>
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleReject}>Reject</Button>
    </MenuItem>
  )
}

const SentInvItem = ({ invitation }) => {
  const [cancelInvitation] = useModifyInvitations()

  const handleCancel = () => {
    cancelInvitation(invitation.id)
  }

  return (
    <MenuItem>
      <Typography>
        You invited {invitation.user.name} to join {invitation.group.name}
      </Typography>
      <Button onClick={handleCancel}>Cancel</Button>
    </MenuItem>
  )
}

const InvitationMenu = () => {
  const username = useSelector((state) => state.user.userData.username)

  const { recvInvitations } = useRecvInvitations()
  const { sentInvitations } = useSentInvitations()

  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenInvitationMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseInvitationMenu = () => {
    setAnchorElUser(null)
  }

  console.log('recvInvitations', recvInvitations)
  console.log('sentInvitations', sentInvitations)

  return (
    <>
      <Tooltip title={username}>
        <IconButton
          onClick={handleOpenInvitationMenu}
          sx={{ p: 1 }}
        >
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/2.jpg"
          />
          <Typography variant="subtitle2">
            {recvInvitations?.length + sentInvitations?.length}
          </Typography>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseInvitationMenu}
      >
        <Typography variant="subtitle2">Received inviations</Typography>
        {recvInvitations?.map((item) => (
          <RecvInvItem
            key={item.id}
            invitation={item}
          />
        ))}
        <Divider />
        {sentInvitations?.map((item) => (
          <SentInvItem
            key={item.id}
            invitation={item}
          />
        ))}
      </Menu>
    </>
  )
}

export default InvitationMenu
