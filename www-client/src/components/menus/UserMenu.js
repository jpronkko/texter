import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { AccountCircle } from '@mui/icons-material'

import useLogInOut from '../../hooks/mutations/useLogInOut'

import ConfirmMessage from '../dialogs/ConfirmMessage'
import ProfileDrawer from './ProfileDrawer'

const UserMenu = () => {
  const username = useSelector((state) => state.user.userData.username)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const confirmDlgRef = useRef()
  const profileDlgRef = useRef()

  const [, logout] = useLogInOut()

  const showLogout = () => {
    confirmDlgRef.current.open()
  }

  const userMenuItems = [
    {
      name: 'Profile',
      callback: () => profileDlgRef.current.toggleProfile(true),
    },
    { name: 'Logout', callback: showLogout },
  ]

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const callItemCallback = (item) => {
    item.callback()
    handleCloseUserMenu()
  }

  return (
    <>
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Logout"
        message="Are you sure you want to logout?"
        onOk={async () => await logout()}
      />
      <ProfileDrawer ref={profileDlgRef} />

      <Tooltip title={username}>
        <IconButton
          id="usermenu-button"
          onClick={handleOpenUserMenu}
          sx={{ p: 1 }}
        >
          <AccountCircle sx={{ color: 'white' }} />

          <Typography
            variant="body1"
            color={'primary.contrastText'}
            sx={{ ml: 1.5 }}
          >
            {username}
          </Typography>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="usermenu"
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
        onClose={handleCloseUserMenu}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            id={`usermenu-${item.name.toLowerCase()}`}
            key={item.name}
            onClick={() => callItemCallback(item)}
          >
            <Typography
              textAlign="center"
              color={'primary.contrastText'}
            >
              {item.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default UserMenu
