/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Divider,
  //Divider,
  Drawer,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import { AddBox, ArrowBack } from '@mui/icons-material'

import { setTopic } from '../../app/selectionSlice'
import useCreateTopic from '../../hooks/useCreateTopic'
import useGetTopics from '../../hooks/useGetTopics'

import InputTextDlg from '../dialogs/InputTextDlg'
import TitleBox from '../TitleBox'
import MessageList from '../MessageList'
import CreateMessage from '../CreateMessage'
import theme from '../../theme'
import { useNavigate } from 'react-router-dom'

const drawerWidth = 250

const MessagesPage = () => {
  //  const user = useSelector((state) => state.user.userData)
  const selectedGroup = useSelector((state) => state.selection.group)
  const selectedTopic = useSelector((state) => state.selection.topic)

  const { topics, error, loading } = useGetTopics(selectedGroup.id)
  const [createTopic] = useCreateTopic()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const topicDlgRef = useRef()

  const handleCreateTopic = async (name) => {
    const topic = await createTopic(selectedGroup.id, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const handleSelectTopic = async (topic) => {
    dispatch(setTopic(topic))
  }

  const renderTopics = () => {
    if (topics) {
      return topics.map((item) => (
        <Button
          variant="text"
          sx={{
            color: 'primary.contrastText',
            backgroundColor:
              selectedTopic?.id === item.id
                ? 'background.drawerPaper'
                : 'background.drawer',
            justifyContent: 'flex-start',
            mx: 2,
          }}
          key={item.id}
          onClick={() => handleSelectTopic(item)}
        >
          # {item.name}
        </Button>
      ))
    } else if (loading) {
      return <Typography>Loading...</Typography>
    }
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'red',
        height: '800px',
      }}
    >
      <InputTextDlg
        ref={topicDlgRef}
        title="Create Topic"
        label="Name"
        handleInput={handleCreateTopic}
      />
      <Drawer
        sx={{
          margin: '0px',
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.drawer',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Typography
          variant="subtitle1"
          sx={{ px: 1.5, py: 1.5, color: 'primary.contrastText' }}
        >
          TOPICS OF {selectedGroup.name}
        </Typography>
        {renderTopics()}
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            py: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddBox />}
            sx={{
              my: 0.5,
              color: 'primary.contrastText',
              justifyContent: 'flex-start',
            }}
            onClick={() => topicDlgRef.current.open()}
          >
            <Typography>Add Topic</Typography>
          </Button>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              my: 0.5,
              color: 'primary.contrastText',
              justifyContent: 'flex-start',
            }}
            onClick={() => navigate('/')}
          >
            <Typography>Groups</Typography>
          </Button>
        </Box>
      </Drawer>
      <Grid
        container
        direction="column"
      >
        {/* <Box
        sx={{
          flexGrow: 1,
          flexDirection: 'column',
          bgcolor: '#f0f0f0',
          py: 1,
          px: 2,
        }}
      > */}
        <Grid
          item
          xs={10}
        >
          <MessageList />
        </Grid>
        <Grid
          item
          xs={2}
        >
          <CreateMessage />
        </Grid>
        {/* </Box> */}
      </Grid>
    </Box>
  )
}

// sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
export default MessagesPage
