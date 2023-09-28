// Original: https://mui.com/material-ui/react-app-bar/, starting mods from there.

import React, { useRef } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

//import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'

import Button from '@mui/material/Button'
import AdbIcon from '@mui/icons-material/Adb'

import { useNavigate } from 'react-router-dom'
import { useSelector, /*useDispatch*/ } from 'react-redux'
import useLogInOut from '../hooks/useLogInOut'
import UserMenu from './UserMenu'
import ConfirmMessage from './dialogs/ConfirmMessage'

const TopBar = () => {
  const confirmDlgRef = useRef()

  const navigate = useNavigate()
  const [, logout] = useLogInOut()

  const user = useSelector(state => state.user.userData)
  const groupName = useSelector(state => state.selection.groupName)

  const userLoggedIn = () => user.username !== ''

  const showLogout = () => {
    confirmDlgRef.current.open()
  }

  const userMenuItems = [
    { name: 'Profile', callback: () => navigate('/profile') },
    { name: 'Logout', callback: showLogout }
  ]

  const loggedInPages = []
  // const loggedInPages = [
  //   { name: 'Home', path: '/' },
  //   { name: 'Groups', path: '/groups' },
  // ]

  const loggedOutPages = []
  // const loggedOutPages = [
  //   { name: 'Login', path: '/login' },
  //   { name: 'Create Account', path: '/create_account' },
  // ]


  const pages = () => { return userLoggedIn() ? loggedInPages : loggedOutPages }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <ConfirmMessage ref={confirmDlgRef} title='Are you sure you want to logout?' onOk={() => logout()}  />
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          TEXTER - user: {user.username} group: {groupName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages().map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {userLoggedIn() && <UserMenu itemList={userMenuItems}/>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default TopBar