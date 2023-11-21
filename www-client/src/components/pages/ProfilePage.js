import React, { useRef } from 'react'
import { Button, Divider, Grid, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useChangePassword from '../../hooks/useChangePassword'
import useChangeEmail from '../../hooks/useChangeEmail'
import NewPasswordDlg from '../dialogs/NewPasswordDlg'
import NewEmailDlg from '../dialogs/NewEmailDlg'

const Profile = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.userData)

  const [changePassword] = useChangePassword()
  const [changeEmail] = useChangeEmail()

  const newPasswordDlg = useRef()
  const newEmailDlg = useRef()

  const handleChangePassword = async (password) => {
    console.log('New password', password)
    await changePassword(password)
  }

  const handleChangeEmail = async (email) => {
    console.log('New email', email)
    await changeEmail(email)
  }

  return (
    <div>
      <NewPasswordDlg
        ref={newPasswordDlg}
        handleInput={handleChangePassword}
      />
      <NewEmailDlg
        ref={newEmailDlg}
        handleInput={handleChangeEmail}
      />
      <Grid
        container
        alignContent="left"
        spacing={-1}
        direction="column"
      >
        <Paper
          elevation={2}
          style={{
            display: 'grid',
            width: '800px',
            gridRowGap: '20px',
            padding: '20px',
            margin: '10px 10px',
          }}
        >
          <Typography variant="h4"> Account details</Typography>
          <Grid
            container
            direction="row"
            padding="10px"
            justifyContent="start"
            alignItems="stretch"
          >
            <Grid
              item
              xs={6}
            >
              <Typography variant="h5">Name</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Grid>
            <Grid>
              <Typography variant="h5">Username</Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <Typography variant="h5">E-mail</Typography>
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
              <Typography variant="h5">Password *******</Typography>
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
            onClick={() => navigate('/')}
          >
            Done
          </Button>
        </Paper>
      </Grid>
    </div>
  )
}

export default Profile
