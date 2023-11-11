import React, { useRef, useState } from 'react'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import ConfirmMessage from './dialogs/ConfirmMessage'

import { useNavigate } from 'react-router-dom'
import useLogInOut from '../hooks/useLogInOut'

const UserMenu = () => {
  const username = useSelector((state) => state.user.userData.username)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const confirmDlgRef = useRef()

  const navigate = useNavigate()
  const [, logout] = useLogInOut()

  const showLogout = () => {
    confirmDlgRef.current.open()
  }

  const userMenuItems = [
    { name: 'Profile', callback: () => navigate('/profile') },
    { name: 'All Users', callback: () => navigate('/users') },
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
        title="Are you sure you want to logout?"
        onOk={() => logout()}
      />
      <Tooltip title={username}>
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0 }}
        >
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/2.jpg"
          />
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
        onClose={handleCloseUserMenu}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.name}
            onClick={() => callItemCallback(item)}
          >
            <Typography textAlign="center">{item.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default UserMenu
