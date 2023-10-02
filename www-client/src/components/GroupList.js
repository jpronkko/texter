import React, { /*useEffect,*/ useRef /*{ useState }*/ } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Divider, Drawer, Toolbar, Typography } from '@mui/material'

import { AddBox } from '@mui/icons-material'

import { addJoinedGroup } from '../app/userSlice'
import useCreateGroup from '../hooks/useCreateGroup'
import useCreateTopic from '../hooks/useCreateTopic'
import { clearGroup, setGroup } from '../app/selectionSlice'

import InputTextDlg from './dialogs/InputTextDlg'
import Topics from './Topics'
import Accordion from './Accordion'
import AccordionSummary from './AccordionSummary'

const drawerWidth = 300

const GroupList = () => {
  const user = useSelector((state) => state.user.userData)
  const group = useSelector((state) => state.selection.group)

  const dispatch = useDispatch()
  const topicDlgRef = useRef()
  const groupDlgRef = useRef()

  const [createGroup] = useCreateGroup()
  const [createTopic] = useCreateTopic()
  /*const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
    handleSelectGroup(newExpanded ? panel : '')
  }*/

  const handleSelectGroup = async (newGroup) => {
    if (newGroup.id === group?.id) return
    console.log('Selecting group:', newGroup)
    if (newGroup) dispatch(setGroup(newGroup))
    else dispatch(clearGroup(newGroup))
  }

  console.log('user groups', user.groups)

  const handleCreateGroup = async (name) => {
    const groupData = await createGroup(name)
    console.log(groupData)
    if (groupData) {
      dispatch(
        addJoinedGroup({
          role: 'OWNER',
          group: { id: groupData.id, name: groupData.name },
        })
      )
    }
    groupDlgRef.current.close()
  }

  const handleCreateTopic = async (name) => {
    const topic = await createTopic(group.id, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const renderedGroups = user.groups.map((item) => (
    <Accordion
      key={item.group.id}
      //expanded={expanded === item.group}
      expanded={group?.id === item.group.id}
      //onChange={handleChange(item.group)}
      onChange={() => handleSelectGroup(item.group)}
    >
      <AccordionSummary key={item.group.id}>
        <Button
          variant="text"
          //onClick={() => handleSelectGroup(item.group)}
          onClick={() => console.log('group foffa!')}
        >
          <Typography>{item.group.name}</Typography>
        </Button>
      </AccordionSummary>
      <Topics
        group={item.group}
        handleCreateTopic={() => topicDlgRef.current.open()}
        selectGroupOfTopic={handleSelectGroup}
      />
      <Button
        variant="text"
        startIcon={<AddBox />}
      >
        <Typography variant="subtitle2">Add Members</Typography>
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
