import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Grid } from '@mui/material'

import TitleBox from '../TitleBox'
import GroupCard from '../GroupCard'
import InputTextDlg from '../dialogs/InputTextDlg'
import ConfirmMessage from '../dialogs/ConfirmMessage'

import useGetUserGroups from '../../hooks/useGetGroups'
import { clearGroup, setGroup } from '../../app/selectionSlice'
import useCreateGroup from '../../hooks/useCreateGroup'
import useRemoveUserFromGroup from '../../hooks/useRemoveUserFromGroup'

const GroupSelectPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const groupDlgRef = useRef()
  const confirmDlgRef = useRef()

  const user = useSelector((state) => state.user.userData)
  const selectedGroup = useSelector((state) => state.selection.group)
  const [createGroup] = useCreateGroup()

  const { ownedGroups, joinedGroups, loading, error } = useGetUserGroups()
  const [removeUserFromGroup] = useRemoveUserFromGroup()

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [user.username])

  const handleSelectGroup = async (newGroup) => {
    console.log('Selecting group:', newGroup, selectedGroup)
    if (selectedGroup && newGroup.id === selectedGroup.id) return
    console.log('Selecting group II:', newGroup)

    if (newGroup) dispatch(setGroup(newGroup))
    else dispatch(clearGroup(newGroup))
    navigate('/messages')
  }

  const handleCreateGroup = async (groupName) => {
    const groupData = await createGroup(groupName)
    console.log(groupData)
    groupDlgRef.current.close()
  }

  const handleLeaveGroup = async (group) => {
    confirmDlgRef.current.open()
    console.log('Leave group', group.name)
  }

  const leaveGroup = async (group) => {
    await removeUserFromGroup(user.id, group.id)
    console.log('Leaving group', group.id)
  }

  const handleManageGroup = async (group) => {
    console.log('Manage group', group)
    dispatch(setGroup(group))
    navigate('/group_admin')
  }

  const renderedOwnedGroups = ownedGroups.map((group) => (
    <Grid
      item
      xs={4}
      key={group.id}
    >
      <GroupCard
        group={group}
        description={'Lorem upsum kumsum' /* item.description */}
        ownGroup
        handleSelectGroup={handleSelectGroup}
        handleManageGroup={handleManageGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </Grid>
  ))

  const renderedOtherJoinedGroups = joinedGroups.map((group) => (
    <Grid
      item
      xs={4}
      key={group.id}
    >
      <GroupCard
        group={group}
        handleSelectGroup={handleSelectGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </Grid>
  ))

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>
  // <CssBaseline />
  return (
    <Container sx={{ mb: 2 }}>
      <InputTextDlg
        ref={groupDlgRef}
        title="Create Group"
        label="Name"
        handleInput={handleCreateGroup}
      />

      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm Leave Group"
        message="Are you sure?"
        onOK={() => leaveGroup(selectedGroup.name)}
      />

      <Grid
        container
        alignContent="left"
        spacing={-1}
        direction="column"
        alignItems="left"
      >
        <Grid
          item
          xs={12}
        >
          <TitleBox title={'Own Groups'}>
            <Button
              variant="contained"
              onClick={() => groupDlgRef.current.open()}
            >
              Create
            </Button>
          </TitleBox>
        </Grid>

        <Grid
          container
          direction={'row'}
          spacing={2}
        >
          {renderedOwnedGroups}
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TitleBox title={'Joined Groups'}></TitleBox>
        </Grid>
        <Grid
          container
          direction={'row'}
          spacing={2}
        >
          {renderedOtherJoinedGroups}
        </Grid>
      </Grid>
    </Container>
  )
}

export default GroupSelectPage

/*
<Grid
          item
          xs={12}
        >
          <Paper
            elevation={2}
            sx={{ my: 2 }}
          >
            <Typography variant="h4">Joined groups</Typography>
          </Paper>
        </Grid>

        <Grid
          container
          direction={'row'}
        >
          {renderedOtherJoinedGroups}
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Button variant="contained">Create Group</Button>
        </Grid> */
/*

<GroupList />
        <Box
          component="main"
          sx={{ flexGrow: 1, margin: '10px', p: 2, backgroundColor: '#f0f0f0' }}
        >
          {topic?.name ? (
            <MessageList />
          ) : (
            <Typography>No topic selected</Typography>
          )}
        </Box>
          */
