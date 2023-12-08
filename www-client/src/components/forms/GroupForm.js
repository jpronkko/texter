import React, { useRef } from 'react'

import { useSelector } from 'react-redux'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'

import InputTextDlg from '../dialogs/InputTextDlg'
import useModifyGroup from '../../hooks/mutations/useModifyGroup'
import { setGroup } from '../../app/selectionSlice'
import { useDispatch } from 'react-redux'

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
          <Grid
            container
            direction={'row'}
            sx={{ mb: 1.5 }}
          >
            <Grid
              item
              xs={12}
              alignItems="stretch"
            >
              <Typography variant="h6">Name</Typography>
            </Grid>
            <Grid
              item
              xs={11}
            >
              <Typography variant="body1">{selectedGroup.name}</Typography>
            </Grid>
            <Grid
              item
              xs={1}
            >
              <Button
                variant="contained"
                onClick={() => nameDlgRef.current.open()}
              >
                Change
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Divider />
          </Grid>
          <Grid
            container
            direction={'row'}
            sx={{ mt: 1.5 }}
          >
            <Grid
              item
              xs={12}
            >
              <Typography variant="h6">Description</Typography>
            </Grid>
            <Grid
              item
              xs={11}
            >
              <Typography variant="body1">
                {selectedGroup.description}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={1}
            >
              <Button
                variant="contained"
                onClick={() => descriptionDlgRef.current.open()}
              >
                Change
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default GroupForm
