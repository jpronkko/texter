import React, { useEffect, useRef }/*{ useState }*/ from 'react'

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

import { TreeItem, TreeView } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { addOwnedGroup } from '../app/userSlice'
import useCreateGroup from '../hooks/useCreateGroup'

import { useDispatch, useSelector } from 'react-redux'
import { AddBox } from '@mui/icons-material'
import { setGroup } from '../app/selectionSlice'
import InputTextDlg from './dialogs/InputTextDlg'

const drawerWidth = 240

const GroupList = () => {
  const inputDlgRef = useRef()
  const user = useSelector(state => state.user.userData)
  const dispatch = useDispatch()
  const [createGroup, ] = useCreateGroup()

  useEffect(() => {
    const groups = user.ownedGroups.length >= 1 ? user.ownedGroups : user.joinedGroups

    if (groups.length >= 1)
      dispatch(setGroup(groups[0]))

  }, [])

  const handleSelectGroup = async (group) => {
    dispatch(setGroup(group))
  }

  const handleCreateGroup = async (name) => {
    console.log('Create griysdssdds', name)
    const group = await createGroup(name)
    dispatch(addOwnedGroup(group))
    inputDlgRef.current.close()
  }

  /*  const handleCreateChannel = () => {
    //showCreateGroup('Create Channel')
  }*/

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
      <InputTextDlg ref={inputDlgRef} title='CreateGroup' handleInput={handleCreateGroup}  />
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
          <TreeItem key={'1'} nodeId='1' label="User Groups">
            {groups}
          </TreeItem>
        </TreeView>

        <Button variant="text" startIcon={<AddBox />}
          style={{ justifyContent: 'flex-start' }}
          onClick={() => inputDlgRef.current.open()}>
          <Typography>Add group</Typography>
        </Button>
        <Divider />
        <Divider />
      </Drawer>
    </div>
  )
}

export default GroupList

/*
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
        <Button variant="text" startIcon={<AddBox />} style={{ justifyContent: 'flex-start' }} onClick={handleCreateChannel}>
          <Typography>New channel</Typography>
        </Button>
      */