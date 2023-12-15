import React, { useRef } from 'react'

import { useSelector } from 'react-redux'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'

import InputTextDlg from '../dialogs/InputTextDlg'
import useModifyGroup from '../../hooks/mutations/useModifyGroup'
import { setGroup } from '../../app/selectionSlice'
import { useDispatch } from 'react-redux'

const GroupItem = ({ title, body, handleChange }) => {
  return (
    <Grid
      container
      direction={'row'}
      sx={{ mb: 1.5 }}
    >
      <Grid
        item
        xs={12}
      >
        <Typography variant="h6">{title}</Typography>
      </Grid>
      <Grid
        item
        xs={10.8}
      >
        <Typography variant="body1">{body}</Typography>
      </Grid>
      <Grid
        item
        xs={1.2}
      >
        <Button
          variant="contained"
          onClick={handleChange}
        >
          <Typography>Change</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

const GroupForm = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.userData)
  const selectedGroup = useSelector((state) => state.selection.group)
  const [modifyGroup] = useModifyGroup(user.id)

  const nameDlgRef = useRef()
  const descriptionDlgRef = useRef()

  const handleChangeName = async (name) => {
    console.log('Change name', name)
    await modifyGroup(selectedGroup.id, name, selectedGroup.description)
    dispatch(setGroup({ ...selectedGroup, name }))
    nameDlgRef.current.close()
  }

  const handleChangeDescription = async (description) => {
    console.log('Change description', description)
    await modifyGroup(selectedGroup.id, selectedGroup.name, description)
    dispatch(setGroup({ ...selectedGroup, description }))
    descriptionDlgRef.current.close()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <InputTextDlg
        ref={nameDlgRef}
        title="Change Name"
        label="Name"
        handleInput={handleChangeName}
      />
      <InputTextDlg
        ref={descriptionDlgRef}
        title="Change Description"
        label="Description"
        handleInput={handleChangeDescription}
      />
      <Paper
        elevation={3}
        style={{
          display: 'grid',
          flexGrow: 1,
          /* gridRowGap: '20px', */
          padding: '20px',
          margin: '1px 0px',
        }}
      >
        <Grid container>
          <GroupItem
            title="Name"
            body={selectedGroup.name}
            handleChange={() => nameDlgRef.current.open()}
          />
          <Grid
            item
            xs={12}
            sx={{ mb: 1.5 }}
          >
            <Divider />
          </Grid>

          <GroupItem
            title="Description"
            body={selectedGroup.description}
            handleChange={() => descriptionDlgRef.current.open()}
          />
        </Grid>
      </Paper>
    </Box>
  )
}

export default GroupForm
