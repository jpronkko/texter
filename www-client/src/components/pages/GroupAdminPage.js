import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, Container, Paper } from '@mui/material'

import useGetUsersNotInGroup from '../../hooks/queries/useGetUsersNotInGroup'
import useCreateInvitation from '../../hooks/mutations/useCreateInvitation'
import useCreateTopic from '../../hooks/mutations/useCreateTopic'
import useGetGroupMembers from '../../hooks/queries/useGetGroupMembers'
import useSentInvitations from '../../hooks/queries/useSentInvitations'

import GroupForm from '../forms/GroupForm'
import GroupMembersTable from '../GroupMembersTable'
import InputTextDlg from '../dialogs/InputTextDlg'
import InvitationsTable from '../InvitationsTable'
import SelectUsersDlg from '../dialogs/SelectUsersDlg'
import TitleBox from '../TitleBox'
import TopicsTable from '../TopicsTable'

const GroupAdminPage = () => {
  const navigate = useNavigate()

  const selectedGroup = useSelector((state) => state.selection.group)
  const sentInvitations = useSentInvitations(selectedGroup?.id)
  const { refetch } = useGetGroupMembers(selectedGroup?.id)

  const [createTopic] = useCreateTopic()
  const { users } = useGetUsersNotInGroup(selectedGroup?.id)
  const currentUser = useSelector((state) => state.user.userData)
  const [createInvitation] = useCreateInvitation()

  useEffect(() => {
    if (!selectedGroup.id) navigate('/')
  }, [selectedGroup])

  useEffect(() => {
    refetch()
  }, [sentInvitations])

  const topicDlgRef = useRef()
  const selectUsersDlgRef = useRef()

  const handleCreateTopic = async (name) => {
    await createTopic(selectedGroup.id, name)
    topicDlgRef.current.close()
  }

  const handleCreateInvitation = async (users) => {
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

  return (
    <Container>
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
      <GroupForm />
      <TitleBox title={'Topics of ' + selectedGroup.name}>
        <Button
          variant="contained"
          onClick={() => topicDlgRef.current.open()}
        >
          Add Topic
        </Button>
      </TitleBox>
      <TopicsTable selectedGroup={selectedGroup} />
      <TitleBox title={'Members of ' + selectedGroup.name} />
      <Paper
        elevation={3}
        sx={{ pt: 2, pb: 2 }}
      >
        <GroupMembersTable groupId={selectedGroup.id} />
      </Paper>
      <TitleBox title={'Invitations to ' + selectedGroup.name}>
        <Button
          id="add-invitation-button"
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
