import React, { useRef } from 'react'

import { useSelector } from 'react-redux'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'

import useModifyGroup from '../../hooks/mutations/useModifyGroup'
import { setGroup } from '../../app/selectionSlice'
import { useDispatch } from 'react-redux'

import InputTextDlg from '../dialogs/InputTextDlg'

const GroupItem = ({ id, title, body, handleChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
      }}
    >
      <div style={{}}>
        <Typography variant="h6">{title}</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          id={id + '-title'}
          variant="body1"
          sx={{ flexGrow: 1 }}
        >
          {body}
        </Typography>
        <Button
          id={id + '-change-button'}
          variant="contained"
          onClick={handleChange}
          sx={{ mt: '10px', mb: '10px', mr: '10px' }}
        >
          <Typography>Change</Typography>
        </Button>
      </div>
    </div>
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
    await modifyGroup(selectedGroup.id, name, selectedGroup.description)
    dispatch(setGroup({ ...selectedGroup, name }))
    nameDlgRef.current.close()
  }

  const handleChangeDescription = async (description) => {
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
          padding: '20px',
          margin: '1px 0px',
        }}
      >
        <Grid container>
          <GroupItem
            id="group-name"
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
            id="group-description"
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
