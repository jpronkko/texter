import React, { /*useEffect,*/ useRef /*{ useState }*/ } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Divider, Drawer, Toolbar, Typography } from '@mui/material'

import { AddBox } from '@mui/icons-material'

import useCreateGroup from '../hooks/useCreateGroup'
import useGetUserGroups from '../hooks/useGroups'
import useCreateTopic from '../hooks/useCreateTopic'
import useCreateInvitation from '../hooks/useCreateInvitation'

import { clearGroup, setGroup } from '../app/selectionSlice'

import InputTextDlg from './dialogs/InputTextDlg'
import Topics from './Topics'
import Accordion from './Accordion'
import AccordionSummary from './AccordionSummary'
import CreateInvitation from './dialogs/CreateInvitation'

const drawerWidth = 300

const GroupList = () => {
  const user = useSelector((state) => state.user.userData)
  const selectedGroup = useSelector((state) => state.selection.group)

  const dispatch = useDispatch()
  const topicDlgRef = useRef()
  const groupDlgRef = useRef()
  const invitationDlgRef = useRef()

  const [createGroup] = useCreateGroup()
  const [createTopic] = useCreateTopic()
  const [createInvitation] = useCreateInvitation()

  const { userGroups, loading, error } = useGetUserGroups()

  console.log('userGroups', userGroups)

  const handleSelectGroup = async (newGroup) => {
    if (newGroup.id === selectedGroup?.id) return
    console.log('Selecting group:', newGroup)
    if (newGroup) dispatch(setGroup(newGroup))
    else dispatch(clearGroup(newGroup))
  }

  console.log(
    'user state',
    user,
    'user groups',
    userGroups,
    'loading:',
    loading,
    'error',
    error
  )

  const handleCreateGroup = async (name) => {
    const groupData = await createGroup(name)
    console.log(groupData)
    groupDlgRef.current.close()
  }

  const handleCreateTopic = async (name) => {
    const topic = await createTopic(selectedGroup.id, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const handleInviteToGroup = async (groupId, userName) => {
    const invitation = await createInvitation(user.id, groupId, userName)
    console.log('Handle Invite to Group', invitation)
    invitationDlgRef.current.close()
  }

  const renderedGroups = userGroups.map((item) => (
    <Accordion
      key={item.id}
      expanded={selectedGroup?.id === item.id}
      onChange={() => handleSelectGroup(item)}
    >
      <AccordionSummary key={item.id}>
        <Button
          variant="text"
          //onClick={() => handleSelectGroup(item.group)}
          onClick={() => console.log('group foffa!')}
        >
          <Typography>{item.name}</Typography>
        </Button>
      </AccordionSummary>
      <Topics
        group={item}
        handleCreateTopic={() => topicDlgRef.current.open()}
        selectGroupOfTopic={handleSelectGroup}
      />
      <Button
        variant="text"
        onClick={() => invitationDlgRef.current.open()}
        // startIcon={<AddBox />}
      >
        <Typography variant="subtitle2"> - Add Members</Typography>
      </Button>
    </Accordion>
  ))

  return (
    <div>
      <InputTextDlg
        ref={groupDlgRef}
        title="Create Group"
        label="Name"
        handleInput={handleCreateGroup}
      />

      <InputTextDlg
        ref={topicDlgRef}
        title="Create Topic"
        label="Name"
        handleInput={handleCreateTopic}
      />

      <CreateInvitation
        ref={invitationDlgRef}
        groupId={selectedGroup?.id}
        handleCreateInvitation={handleInviteToGroup}
      />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Typography>Huppa Luppa</Typography>
        <Divider />
        {renderedGroups}
        <Button
          variant="text"
          startIcon={<AddBox />}
          style={{ justifyContent: 'flex-start' }}
          onClick={() => groupDlgRef.current.open()}
        >
          <Typography>Add group</Typography>
        </Button>
        <Divider />
      </Drawer>
    </div>
  )
}

export default GroupList
