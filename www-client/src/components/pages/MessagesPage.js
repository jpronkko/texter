/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Container,
  Divider,
  //Divider,
  Drawer,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import { AddBox, ArrowBack } from '@mui/icons-material'

import { setTopic } from '../../app/selectionSlice'
import useCreateTopic from '../../hooks/mutations/useCreateTopic'
import useGetTopics from '../../hooks/queries/useGetTopics'

import CreateMessage from '../CreateMessage'
import InputTextDlg from '../dialogs/InputTextDlg'
import MessageList from '../MessageList'

const drawerWidth = 250

const MessagesPage = () => {
  const selectedGroup = useSelector((state) => state.selection.group)
  const selectedTopic = useSelector((state) => state.selection.topic)

  const { topics, error, loading } = useGetTopics(selectedGroup.id)
  const [createTopic] = useCreateTopic()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const topicDlgRef = useRef()

  useEffect(() => {
    console.log('topics', topics, 'selectedTopic', selectedTopic)
    if (!selectedTopic.name && topics && topics.length > 0) {
      dispatch(setTopic(topics[0]))
    }
  }, [topics])

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
        flexDirection: 'column',

        flex: '1',
        height: '120%',
        backgroundColor: 'red',
        position: 'relative',
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
            py: 1,
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

      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: drawerWidth + 5,
          top: 5,
          height: '100vh', //`calc(100% - 10px)`,
          width: `calc(100% - ${drawerWidth + 50}px)`,
          backgroundColor: 'red',
          margin: '0px',
          padding: '2px',
        }}
      >
        <MessageList />

        <CreateMessage />
      </Box>
    </Box>
  )
}

export default MessagesPage
