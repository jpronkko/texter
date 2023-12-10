import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Container, Grid } from '@mui/material'

import ConfirmMessage from '../dialogs/ConfirmMessage'
import CreateGroupDlg from '../dialogs/CreateGroupDlg'
import GroupCard from '../GroupCard'
import TitleBox from '../TitleBox'

import useCreateGroup from '../../hooks/mutations/useCreateGroup'
import useRemoveUserFromGroup from '../../hooks/mutations/useRemoveUserFromGroup'
import useGetUserGroups from '../../hooks/queries/useGetGroups'
import useUserAddSubsription from '../../hooks/subscriptions/useUserAddSubscription'
import useUserRemoveSubscription from '../../hooks/subscriptions/useUserRemoveSubscription'

import { clearGroup, setGroup } from '../../app/selectionSlice'

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
  const userAdded = useUserAddSubsription(user.id)
  const userRemoved = useUserRemoveSubscription(user.id)

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [user.username])

  useEffect(() => {
    console.log('Selecting this page', selectedGroup)
    dispatch(clearGroup())
  }, [])

  console.log(
    `Group select page subs result useradd: ${JSON.stringify(
      userAdded,
      null,
      4
    )}, userremoved: ${JSON.stringify(userRemoved, null, 4)}`
  )
  const handleSelectGroup = async (newGroup) => {
    console.log('Selecting group:', newGroup, selectedGroup)
    /* if (selectedGroup && newGroup.id === selectedGroup.id) return
    console.log('Selecting group II:', newGroup)
 */
    if (newGroup) dispatch(setGroup(newGroup))
    else dispatch(clearGroup(newGroup))
    navigate('/messages')
  }

  let groupToLeave = undefined

  const handleCreateGroup = async (name, description) => {
    console.log('Create group I:', name, description)
    const groupData = await createGroup(name, description)
    console.log(groupData)
    groupDlgRef.current.close()
  }

  const handleLeaveGroup = async (group) => {
    groupToLeave = group
    confirmDlgRef.current.open()
    console.log('Leave group', group.name)
  }

  const leaveGroup = async () => {
    console.log('Leaving group', groupToLeave)
    await removeUserFromGroup(user.id, groupToLeave.id)
    confirmDlgRef.current.close()
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
        ownGroup={true}
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
        ownGroup={false}
        handleSelectGroup={handleSelectGroup}
        handleLeaveGroup={handleLeaveGroup}
      />
    </Grid>
  ))

  if (loading) return <div>Loading...</div>

  if (error) {
    navigate('/login')
    //return <div>Error: {error.message}</div>
  }
  // <CssBaseline />
  return (
    <Container sx={{ mb: 2 }}>
      <CreateGroupDlg
        ref={groupDlgRef}
        handleInput={handleCreateGroup}
      />

      <ConfirmMessage
        ref={confirmDlgRef}
        title="Leave Group"
        message="Are you sure you want to leave this group?"
        onOk={leaveGroup}
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
          <TitleBox title={'Other Joined Groups'}></TitleBox>
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
