import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Container, Paper, Typography } from '@mui/material'

import useGetTopics from '../../hooks/queries/useGetTopics'
import useGetUsersNotInGroup from '../../hooks/queries/useGetUsersNotInGroup'
import useSentInvitations from '../../hooks/queries/useSentInvitations'

import useCreateInvitation from '../../hooks/mutations/useCreateInvitation'
import useCreateTopic from '../../hooks/mutations/useCreateTopic'
import useRemoveTopic from '../../hooks/mutations/useRemoveTopic'

import useTopicsAddedSubscription from '../../hooks/subscriptions/useTopicsAddedSubscriptions'
import useTopicRemovedSubscription from '../../hooks/subscriptions/useTopicRemovedSubscription'

import GroupForm from '../forms/GroupForm'
import GroupMembersTable from '../GroupMembersTable'
import ConfirmMessage from '../dialogs/ConfirmMessage'
import InputTextDlg from '../dialogs/InputTextDlg'
import InvitationsTable from '../InvitationsTable'
import SelectUsersDlg from '../dialogs/SelectUsersDlg'
import TitleBox from '../TitleBox'

const GroupItem = ({ topic, handleRemoveTopic }) => {
  return (
    <Box
      key={topic.id}
      display="flex"
      sx={{ mt: 1, flexDirection: 'row', justifyContent: 'space-between' }}
    >
      <Typography variant="h6">{topic.name}</Typography>
      <Button
        variant="contained"
        onClick={() => handleRemoveTopic(topic.id)}
      >
        Remove
      </Button>
    </Box>
  )
}

const GroupAdminPage = () => {
  const navigate = useNavigate()

  const selectedGroup = useSelector((state) => state.selection.group)

  const { topics, error, loading } = useGetTopics(selectedGroup?.id)
  const [createTopic, result] = useCreateTopic()
  const { sentInvitations } = useSentInvitations()
  const { users /*error: _error loading*/ } = useGetUsersNotInGroup(
    selectedGroup?.id
  )
  const currentUser = useSelector((state) => state.user.userData)
  const [createInvitation] = useCreateInvitation()
  const [removeTopic] = useRemoveTopic()

  const newTopics = useTopicsAddedSubscription(selectedGroup.id)
  const removedTopics = useTopicRemovedSubscription(selectedGroup.id)

  useEffect(() => {
    console.log('selectedGroup', selectedGroup.id)
    if (!selectedGroup.id) navigate('/')
  }, [selectedGroup])

  console.log('newTopics', newTopics, 'removedTopics', removedTopics)
  const confirmDlgRef = useRef()
  const topicDlgRef = useRef()
  const selectUsersDlgRef = useRef()
  let topicIdToRemove = undefined

  console.log('sentInvitations', sentInvitations)
  console.log('group', selectedGroup, 'topics', topics, 'result', result)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const handleFormSubmit = (data) => {
    console.log('Create group form submitted', data)
  }

  const handleCreateTopic = async (name) => {
    const topic = await createTopic(selectedGroup.id, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const handleCreateInvitation = async (users) => {
    console.log('Handle Create Invitation', users)
    const allInvites = []
    users.forEach(async (user) => {
      const invitation = await createInvitation(
        currentUser.id,
        selectedGroup.id,
        user.username
      )
      allInvites.push(invitation)
    })

    await Promise.all(allInvites)
  }

  const handleRemoveTopic = (topicId) => {
    console.log('Remove topic', topicId)
    topicIdToRemove = topicId
    confirmDlgRef.current.open()
  }

  const onOkRemoveTopic = async () => {
    console.log('onOkRemoveTopic')
    await removeTopic(selectedGroup.id, topicIdToRemove)
  }

  return (
    <Container>
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm"
        message="Are you sure you want to remove this topic and its contents?"
        onOk={onOkRemoveTopic}
      />
      <InputTextDlg
        ref={topicDlgRef}
        title="Create Topic"
        label="Name"
        handleInput={handleCreateTopic}
      />
      <SelectUsersDlg
        ref={selectUsersDlgRef}
        title="Add Member"
        users={users}
        handleUsers={handleCreateInvitation}
      />
      <TitleBox title={'Profile of ' + selectedGroup.name} />
      <GroupForm handleFormSubmit={handleFormSubmit} />
      <TitleBox title={'Topics of ' + selectedGroup.name}>
        <Button
          variant="contained"
          onClick={() => topicDlgRef.current.open()}
        >
          Add Topic
        </Button>
      </TitleBox>
      <Paper
        elevation={3}
        sx={{ p: 2 }}
      >
        {topics.map((item) => (
          <GroupItem
            key={item.id}
            topic={item}
            handleRemoveTopic={handleRemoveTopic}
          />
        ))}
      </Paper>
      <TitleBox title={'Members of ' + selectedGroup.name} />
      <Paper
        elevation={3}
        sx={{ pt: 2, pb: 2 }}
      >
        <GroupMembersTable groupId={selectedGroup.id} />
      </Paper>
      <TitleBox title={'Invitations to ' + selectedGroup.name}>
        <Button
          variant="contained"
          onClick={() => selectUsersDlgRef.current.open()}
        >
          Add Invitation
        </Button>
      </TitleBox>
      <Paper
        elevation={3}
        sx={{ pt: 2, pb: 2 }}
      >
        <InvitationsTable />
      </Paper>
    </Container>
  )
}

export default GroupAdminPage
