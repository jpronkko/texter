// Original: https://mui.com/material-ui/react-app-bar/, starting mods from there.
import React from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

//import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import { BorderColor } from '@mui/icons-material'
import { useSelector /*useDispatch*/ } from 'react-redux'

import InvitationMenu from './InvitationMenu'
import UserMenu from './UserMenu'

const TopBar = () => {
  const user = useSelector((state) => state.user.userData)
  const group = useSelector((state) => state.selection.group)
  const topic = useSelector((state) => state.selection.topic)

  const userLoggedIn = () => user.username !== ''

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
          <Typography>
            group: {group?.name} topic: {topic?.name}
          </Typography>
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
/*
<Box sx={{ flexGrow: 1 }}>
            </Box>
            <Box sx={{ flexGrow: 1 }}></Box>
*/
export default TopBar

/*
  const loggedInPages = [
    { name: 'Invitations', path: '/' },
    //   { name: 'Groups', path: '/groups' },
  ]

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
        */
