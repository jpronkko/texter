import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'

import useChangePassword from '../../hooks/mutations/useChangePassword'
import useChangeEmail from '../../hooks/mutations/useChangeEmail'

import NewPasswordDlg from '../dialogs/NewPasswordDlg'
import NewEmailDlg from '../dialogs/NewEmailDlg'

const drawerWidth = 400

const ProfileDrawer = forwardRef((props, ref) => {
  const [profileOpen, setProfileOpen] = useState(false)

  const user = useSelector((state) => state.user.userData)

  const [changePassword] = useChangePassword()
  const [changeEmail] = useChangeEmail()

  const newPasswordDlg = useRef()
  const newEmailDlg = useRef()

  useImperativeHandle(ref, () => {
    return {
      toggleProfile,
    }
  })

  const toggleProfile = (open) => {
    setProfileOpen(open)
  }

  const handleChangePassword = async (oldPassword, newPassword) => {
    console.log('New password', newPassword)
    const result = await changePassword(oldPassword, newPassword)
    if (result) {
      newPasswordDlg.current.close()
    }
  }

  const handleChangeEmail = async (password, newEmail) => {
    console.log('Password', password, 'email', newEmail)
    const result = await changeEmail(password, newEmail)
    if (result) {
      newEmailDlg.current.close()
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <NewPasswordDlg
        ref={newPasswordDlg}
        handleInput={handleChangePassword}
      />
      <NewEmailDlg
        ref={newEmailDlg}
        handleInput={handleChangeEmail}
      />
      <Drawer
        sx={{
          margin: '0px',
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.drawer',
          },
        }}
        /* variant="permanent" */
        open={profileOpen}
        onClose={() => toggleProfile(false)}
        anchor="right"
      >
        <Toolbar />
        <Grid
          container
          alignContent="left"
          spacing={0}
          direction="column"
        >
          <Paper
            elevation={3}
            style={{
              display: 'grid',
              /* width: drawerWidth - 5, */
              gridRowGap: '20px',
              /* padding: '10px',
              margin: '10px 10px', */
              margin: '12px',
              padding: '25px',
            }}
          >
            <Typography variant="h5"> Account details</Typography>
            <Grid item>
              <Typography variant="h6">Name</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Grid>
            <Divider />
            <Grid
              item
              xs={12}
            >
              <Typography variant="h6">Username</Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Grid>

            <Divider />

            <Grid
              container
              direction="row"
              alignItems="stretch"
            >
              <Grid
                item
                xs={9}
                alignItems="stretch"
              >
                <Typography variant="h6">E-mail</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
              <Grid
                item
                xs={3}
              >
                <Button
                  id="new-email-button"
                  onClick={() => newEmailDlg.current.open()}
                  variant={'contained'}
                >
                  Change
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              direction="row"
            >
              <Grid
                item
                xs={9}
              >
                <Typography variant="h6">Password</Typography>
                <Typography variant="body1">**************</Typography>
              </Grid>
              <Grid
                item
                xs={3}
              >
                <Button
                  id="new-password-button"
                  onClick={() => newPasswordDlg.current.open()}
                  variant={'contained'}
                >
                  Change
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <Button
              variant={'contained'}
              onClick={() => toggleProfile(false)}
            >
              Done
            </Button>
          </Paper>
        </Grid>
      </Drawer>
    </Box>
  )
})

ProfileDrawer.displayName = 'ProfileDrawer'

export default ProfileDrawer
