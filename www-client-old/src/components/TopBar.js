// Original: https://mui.com/material-ui/react-app-bar/, starting mods from there.

import React from 'react'
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
import useConfirmMessage from '../hooks/useConfirmMessage'
import UserMenu from './UserMenu'


const TopBar = () => {
  const navigate = useNavigate()
  const [, logout] = useLogInOut()
  const [showMessage] = useConfirmMessage()

  const user = useSelector(state => state.user.userData)
  const group = useSelector(state => state.group)

  const userLoggedIn = () => user.username !== ''

  const showLogout = () => {
    showMessage('Logout','Are you sure you want to logout?', logout)
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
          TEXTER - user: {user.username} group: {group.name}
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

// //const [anchorElNav, setAnchorElNav] = useState(null)
/*const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  */
/*const userMenu = () => {
    return (
      userLoggedIn &&
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages().map((page) => (
            <MenuItem key={page.name} onClick={() => handleCloseNavMenu(page.path)}>
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    )
  }*/

/*
 <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TEXTERbbb
          </Typography>
          */