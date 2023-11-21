import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  //  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

//import useSentInvitations from '../hooks/useSentInvitations'
import useRecvInvitations from '../hooks/useRecvInvitations'
//import useModifySentInv from '../hooks/useModifySentInv'
import useModifyRecvInv from '../hooks/useModifyRecvInv'
import { Email } from '@mui/icons-material'

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

/* const SentInvItem = ({ invitation }) => {
  //const [cancelInvitation] = useModifySentInv()

  const handleCancel = () => {
    cancelInvitation(invitation.id)
  }

  return (
    <MenuItem>
      <Typography>
        You invited {invitation.toUser.username} to join {invitation.group.name}
      </Typography>
      <Button onClick={handleCancel}>Cancel</Button>
    </MenuItem>
  )
}
 */
const InvitationMenu = () => {
  const username = useSelector((state) => state.user.userData.username)
  const userId = useSelector((state) => state.user.userData.id)

  const { recvInvitations, foo /* refetch */ } = useRecvInvitations(userId)
  //const { sentInvitations } = useSentInvitations(userId)
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
  //console.log('sentInvitations', sentInvitations)
  console.log('foo', foo)

  const renderInvitations = () => {
    if (rInvitations) {
      return rInvitations.map((item) => (
        <RecvInvItem
          key={item.id}
          invitation={item}
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
          onClick={handleOpenInvitationMenu}
          sx={{ p: 1 }}
        >
          <Email sx={{ color: 'white' }} />
          <Typography
            variant="subtitle2"
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
        <Typography variant="subtitle2">Received inviations</Typography>
        {renderInvitations()}
        {/*         {sentInvitations?.map((item) => (
          <SentInvItem
            key={item.id}
            invitation={item}
          />
        ))}
 */}{' '}
      </Menu>
    </>
  )
}

export default InvitationMenu
