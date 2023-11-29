import React, { useRef } from 'react'

import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'

import InputTextDlg from '../dialogs/InputTextDlg'
import { useSelector } from 'react-redux'

const GroupForm = () => {
  const selectedGroup = useSelector((state) => state.selection.group)
  const nameDlgRef = useRef()
  const descriptionDlgRef = useRef()

  const handleChangeName = async (name) => {
    console.log('Change name', name)
    nameDlgRef.current.close()
  }

  const handleChangeDescription = async (description) => {
    console.log('Change description', description)
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
