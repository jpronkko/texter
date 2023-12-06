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
      control={
        <Checkbox
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
      setSelectedUsers(selectedUsers.filter((item) => item.id !== user.id))
    }
  }

  const onUsersSelected = () => {
    handleUsers(selectedUsers)
    close()
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
          <FormGroup>
            {users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                selectUser={selectUser}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
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
