import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Container, Grid } from '@mui/material'

import ConfirmMessage from '../dialogs/ConfirmMessage'
import CreateGroupDlg from '../dialogs/CreateGroupDlg'
import GroupCard from '../GroupCard'
import Loading from '../Loading'
import TitleBox from '../TitleBox'

import useCreateGroup from '../../hooks/mutations/useCreateGroup'
import useGetUserGroups from '../../hooks/queries/useGetGroups'
import useLogInOut from '../../hooks/mutations/useLogInOut'
import useRemoveUserFromGroup from '../../hooks/mutations/useRemoveUserFromGroup'
import useUserAddSubsription from '../../hooks/subscriptions/useUserAddSubscription'
import useUserRemoveSubscription from '../../hooks/subscriptions/useUserRemoveSubscription'

import { clearGroup, setGroup } from '../../app/selectionSlice'

const GroupSelectPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const groupDlgRef = useRef()
  const confirmDlgRef = useRef()

  const user = useSelector((state) => state.user.userData)
  const [createGroup] = useCreateGroup()

  const { ownedGroups, joinedGroups, loading, error } = useGetUserGroups()
  const [removeUserFromGroup] = useRemoveUserFromGroup()
  const [logOut] = useLogInOut()

  useUserAddSubsription(user.id)
  useUserRemoveSubscription(user.id)

  useEffect(() => {
    if (user.username === '') {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [user.username])

  useEffect(() => {
    dispatch(clearGroup())
  }, [])

  useEffect(() => {
    const callLogout = async () => {
      await logOut()
    }

    if (error) {
      callLogout()
    }
  }, [error])

  let groupToLeave = undefined

  const handleCreateGroup = async (name, description) => {
    await createGroup(name, description)
    groupDlgRef.current.close()
  }

  const handleSelectGroup = async (newGroup) => {
    if (newGroup) dispatch(setGroup(newGroup))
    else dispatch(clearGroup(newGroup))
    navigate('/messages')
  }

  const handleLeaveGroup = async (group) => {
    groupToLeave = group
    confirmDlgRef.current.open()
    console.log('Leave group', group.name)
  }

  const leaveGroup = async () => {
    await removeUserFromGroup(user.id, groupToLeave.id)
    confirmDlgRef.current.close()
  }

  const handleManageGroup = async (group) => {
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

  if (loading) return <Loading />

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
              id="create-group-button"
              variant="contained"
              onClick={() => groupDlgRef.current.open()}
            >
              Create
            </Button>
          </TitleBox>
        </Grid>

        <Grid
          id="owned-groups"
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
          id="other-joined-groups"
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
