import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import { Email } from '@mui/icons-material'

import useRecvInvitations from '../../hooks/queries/useRecvInvitations'
import useModifyRecvInv from '../../hooks/mutations/useModifyRecvInv'

const RecvInvItem = ({ invitation }) => {
  const [acceptInvitation, rejectInvitation] = useModifyRecvInv()

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
        {invitation.fromUser.username} invited you to {invitation.group.name},
        status is {invitation.status}
      </Typography>
      <Button onClick={handleAccept}>Accept</Button>
      <Button onClick={handleReject}>Reject</Button>
    </MenuItem>
  )
}

const InvitationMenu = () => {
  const username = useSelector((state) => state.user.userData.username)
  const userId = useSelector((state) => state.user.userData.id)

  const { recvInvitations /* fetchMore, loading, error, refetch */ } =
    useRecvInvitations(userId)

  const rInvitations = recvInvitations?.filter(
    (inv) => inv.status === 'PENDING'
  )
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenInvitationMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseInvitationMenu = () => {
    setAnchorElUser(null)
  }

  console.log('recvInvitations', recvInvitations)

  const renderInvitations = () => {
    if (rInvitations && rInvitations.length > 0) {
      return rInvitations.map((item) => (
        <RecvInvItem
          key={item.id}
          invitation={item}
        />
      ))
    } else {
      console.log('No invitations')
      return (
        <MenuItem>
          <Typography>No invitations</Typography>
        </MenuItem>
      )
    }
  }
  return (
    <>
      <Tooltip title={username}>
        <IconButton
          onClick={handleOpenInvitationMenu}
          sx={{ p: 1, mx: 1 }}
        >
          <Email sx={{ mx: 1, color: 'white' }} />
          <Typography
            variant="body1"
            color={'primary.contrastText'}
          >
            {rInvitations?.length === 0
              ? 'No invitations'
              : 'New invitations' + rInvitations?.length}
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
        {renderInvitations()}
      </Menu>
    </>
  )
}

export default InvitationMenu
