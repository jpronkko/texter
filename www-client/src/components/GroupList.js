//import { useEffect, useState } from 'react';
import React, { useState } from 'react'

import {
  Button,
  Divider,
  Drawer,
  //List,
  //ListItem,
  //ListItemButton,
  //ListItemIcon,
  //ListItemText,
  Toolbar,
  Typography,
  //TreeItem,
//  TreeView,
  //Typography
} from '@mui/material'

import { TreeItem, TreeView } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import CreateGroupForm from './forms/CreateGroupForm'
import { addOwnedGroup } from '../app/userSlice'
import useCreateGroup from '../hooks/useCreateGroup'

import { useDispatch, useSelector } from 'react-redux'
import { AddBox } from '@mui/icons-material'
import { setGroup } from '../app/groupSlice'

const drawerWidth = 240

const GroupList = () => {
  const user = useSelector(state => state.user.userData)

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [createGroup, ] = useCreateGroup()

  const dispatch = useDispatch()

  const userLoggedIn = () => user.username !== ''

  const handleCreateGroup = async (name) => {
    console.log('Creating group', name)
    const id = await createGroup(name)
    dispatch(addOwnedGroup(id))
    setIsCreatingGroup(false)
  }

  const handleSelectGroup = async (group) => {
    dispatch(setGroup(group))
  }
  const handleClick = () => {
    setIsCreatingGroup(true)
  }

  console.log(user)
  const groups = user.ownedGroups.map((group) => (
    <TreeItem
      key={group.Id}
      nodeId={group.Id}
      label={'# ' + group.name}
      onClick={() => handleSelectGroup(group)}
    />
  ))

  return (
    <div>
      { userLoggedIn() && isCreatingGroup && <CreateGroupForm handleCreate={handleCreateGroup} /> }
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <TreeView
          aria-label="User Groups"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ m: 2 }}
        >
          <TreeItem nodeId='1' label="User Groups">
            {groups}
          </TreeItem>
        </TreeView>

        <Button variant="text" startIcon={<AddBox />} style={{ justifyContent: 'flex-start' }} onClick={handleClick}>
          <Typography>Add group</Typography>
        </Button>
        <Divider />
        <TreeView
          aria-label="Channels"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ m: 2 }}
        >
          <TreeItem nodeId='0' label="Channels">
            {groups}
          </TreeItem>
        </TreeView>
        <Button variant="text" startIcon={<AddBox />} style={{ justifyContent: 'flex-start' }} onClick={handleClick}>
          <Typography>New channel</Typography>
        </Button>
        <Divider />
      </Drawer>
    </div>
  )
}

export default GroupList
