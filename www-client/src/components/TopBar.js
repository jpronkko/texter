// Original: https://mui.com/material-ui/react-app-bar/, starting mods from there.
import React from 'react'
import { useSelector } from 'react-redux'

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { BorderColor } from '@mui/icons-material'

import NotifyMessage from './dialogs/NotifyMessage'
import InvitationMenu from './menus/InvitationMenu'
import UserMenu from './menus/UserMenu'
import { useLocation } from 'react-router-dom'

const TopBar = () => {
  const location = useLocation()

  const user = useSelector((state) => state.user.userData)
  /* const group = useSelector((state) => state.selection.group)
  const topic = useSelector((state) => state.selection.topic)
 */
  const userLoggedIn = () => user.username !== ''

  const renderGroup = () => {
    if (location.pathname === '/') return null
    return (
      <>
        <Button
          variant="contained"
          href="/"
        >
          <Typography>Browse Groups</Typography>
        </Button>
      </>
    )
  }

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BorderColor sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
            TEXTER
          </Typography>
          <NotifyMessage />
          {renderGroup()}

          <Box
            sx={{
              display: 'flex',
              direction: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            <Box sx={{ mx: 1 }}>{userLoggedIn() && <InvitationMenu />}</Box>
            <Box sx={{ mx: 1 }}>{userLoggedIn() && <UserMenu />}</Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default TopBar
