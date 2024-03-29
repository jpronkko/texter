import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Box,
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
import useRecvInvSubscription from '../../hooks/subscriptions/useRecvInvSubscription'
import useInvStatusSubscription from '../../hooks/subscriptions/useInvStatusSubscriptions'

const RecvInvItem = ({ invitation, closeMenu }) => {
  const [acceptInvitation, rejectInvitation] = useModifyRecvInv()

  const handleAccept = async () => {
    await acceptInvitation(invitation.id)
    closeMenu()
  }

  const handleReject = async () => {
    await rejectInvitation(invitation.id)
    closeMenu()
  }

  return (
    <MenuItem>
      <Box
        display="flex"
        flexDirection="row"
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{ flex: 1, p: 1 }}
      >
        <Typography id="invitation-label">
          Invite to {invitation.group.name} from {invitation.fromUser.username}{' '}
          {invitation.status}
        </Typography>
        <Box sx={{ ml: 2 }}>
          <Button
            id="invitation-accept-button"
            variant="contained"
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            id="invitation-reject-button"
            variant="contained"
            sx={{ ml: 1 }}
            onClick={handleReject}
          >
            Reject
          </Button>
        </Box>
      </Box>
    </MenuItem>
  )
}

const InvitationMenu = () => {
  const username = useSelector((state) => state.user.userData.username)
  const userId = useSelector((state) => state.user.userData.id)

  const { recvInvitations } = useRecvInvitations(userId)

  useRecvInvSubscription(userId)
  useInvStatusSubscription(userId)

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

  const renderInvitations = () => {
    if (rInvitations && rInvitations.length > 0) {
      return rInvitations.map((item) => (
        <RecvInvItem
          key={item.id}
          invitation={item}
          closeMenu={handleCloseInvitationMenu}
        />
      ))
    } else {
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
          id="invitation-menu-button"
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
              : 'Pending invitations!'}
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
