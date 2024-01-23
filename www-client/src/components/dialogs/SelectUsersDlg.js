import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material'
import React, { forwardRef, useState, useImperativeHandle } from 'react'

const UserItem = ({ user, selectUser }) => {
  const [userSelected, setUserSelected] = useState(false)

  const handleChange = (event) => {
    setUserSelected(event.target.checked)
    selectUser(user, event.target.checked)
  }

  return (
    <FormControlLabel
      id="user-label"
      control={
        <Checkbox
          id="user-checkbox"
          checked={userSelected}
          onChange={handleChange}
          name={user.email}
        />
      }
      label={user.name + ' aka ' + user.username}
    />
  )
}

const SelectUsersDlg = forwardRef((props, ref) => {
  const { users, handleUsers } = props
  const [visible, setVisible] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])

  const open = () => {
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
    }
  })

  const selectUser = (user, selected) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      const newUsers = selectedUsers.filter((item) => item.id !== user.id)
      setSelectedUsers(newUsers)
    }
  }

  const onUsersSelected = () => {
    handleUsers(selectedUsers)
    setSelectedUsers([])
    close()
  }

  const renderUsers = () => {
    if (!users || users.length === 0)
      return (
        <Typography>
          No users available or everybody invited already!
        </Typography>
      )
    return users.map((user) => (
      <UserItem
        key={user.id}
        user={user}
        selectUser={selectUser}
      />
    ))
  }
  return (
    <Dialog
      open={visible}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Select Users</DialogTitle>
      <DialogContent>
        <FormControl
          sx={{ m: 3 }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Select users to invite</FormLabel>
          <FormGroup>{renderUsers()}</FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          id="selection-ok-button"
          variant="contained"
          onClick={onUsersSelected}
        >
          OK
        </Button>
        <Button onClick={close}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
})

SelectUsersDlg.displayName = 'SelectUsersDlg'
export default SelectUsersDlg
