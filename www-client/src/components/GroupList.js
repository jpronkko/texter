import React, { /*useEffect,*/ useRef /*{ useState }*/ } from 'react'

import {
  Button,
  Divider,
  Drawer,
  Toolbar,
  Typography,
  //TreeItem,
  //  TreeView,
  //Typography
} from '@mui/material'

/*import { TreeItem, TreeView } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
*/
import { addJoinedGroup } from '../app/userSlice'
import useCreateGroup from '../hooks/useCreateGroup'
import useCreateTopic from '../hooks/useCreateTopic'

import { useDispatch, useSelector } from 'react-redux'
import { AddBox } from '@mui/icons-material'
import { setGroup /*setTopic */ } from '../app/selectionSlice'
import InputTextDlg from './dialogs/InputTextDlg'
import Topics from './Topics'
import Accordion from './Accordion'
import AccordionSummary from './AccordionSummary'

const drawerWidth = 300

const GroupList = () => {
  const user = useSelector((state) => state.user.userData)
  const groupId = useSelector((state) => state.selection.groupId)

  const dispatch = useDispatch()
  const topicDlgRef = useRef()
  const groupDlgRef = useRef()

  const [createGroup] = useCreateGroup()
  const [createTopic] = useCreateTopic()
  const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const handleSelectGroup = async (groupId) => {
    dispatch(setGroup(groupId))
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
    const topic = await createTopic(groupId, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const renderedGroups = user.groups.map((item) => (
    <Accordion
      key={item.group.id}
      expanded={expanded === item.group.name}
      onChange={handleChange(item.group.name)}
    >
      <AccordionSummary key={item.group.id}>
        <Button
          variant="text"
          onClick={() => handleSelectGroup(item.group.id)}
        >
          <Typography>{item.group.name}</Typography>
        </Button>
      </AccordionSummary>
      <Topics
        groupId={item.group.id}
        handleCreateTopic={() => topicDlgRef.current.open()}
      />
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
