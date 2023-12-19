import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Drawer, Toolbar, Typography } from '@mui/material'
import { AddBox } from '@mui/icons-material'

import { setTopic } from '../../app/selectionSlice'
import useCreateTopic from '../../hooks/mutations/useCreateTopic'
import useGetTopics from '../../hooks/queries/useGetTopics'

import CreateMessage from '../CreateMessage'
import InputTextDlg from '../dialogs/InputTextDlg'
import MessageList from '../MessageList'
import useGetUserGroups from '../../hooks/queries/useGetGroups'
import useTopicsAddedSubscription from '../../hooks/subscriptions/useTopicsAddedSubscriptions'
import useTopicRemovedSubscription from '../../hooks/subscriptions/useTopicRemovedSubscription'

const drawerWidth = 250

const MessagesPage = () => {
  const selectedGroup = useSelector((state) => state.selection.group)
  const selectedTopic = useSelector((state) => state.selection.topic)
  const { joinedGroups } = useGetUserGroups()

  console.log('groups', joinedGroups)
  const { topics, error, loading } = useGetTopics(selectedGroup.id)
  const [createTopic] = useCreateTopic()
  useTopicsAddedSubscription(selectedGroup.id)
  useTopicRemovedSubscription(selectedGroup.id)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const topicDlgRef = useRef()

  useEffect(() => {
    if (error) {
      navigate('/')
    }
  }, [error])

  useEffect(() => {
    if (!selectedTopic.name && topics && topics.length > 0) {
      dispatch(setTopic(topics[0]))
    }
  }, [topics])

  const handleCreateTopic = async (name) => {
    const topic = await createTopic(selectedGroup.id, name)
    console.log('Handle Create Topic', topic)
    topicDlgRef.current.close()
  }

  const handleSelectTopic = (topic) => {
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

  // Display Add Topic button only if user is OWNER or ADMIN of the group
  const renderAddTopicButton = () => {
    const group = joinedGroups.find((group) => group.id === selectedGroup.id)
    if (group && group.role !== 'ADMIN') return null

    return (
      <Button
        variant="contained"
        startIcon={<AddBox />}
        sx={{
          mb: 1.0,
          mx: 1.2,
          py: 1.2,
          color: 'primary.contrastText',
          justifyContent: 'flex-start',
        }}
        onClick={() => topicDlgRef.current.open()}
      >
        <Typography>Add Topic</Typography>
      </Button>
    )
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
        margin: '0px',
        padding: '0px',
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
        {renderAddTopicButton()}
        {renderTopics()}
      </Drawer>

      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: drawerWidth + 5,
          top: 5,
          height: `calc(100vh - 80px)`,
          width: `calc(100% - ${drawerWidth + 10}px)`,
          /* backgroundColor: 'red', */
          margin: '0px',
          padding: '2px',
          alignItems: selectedTopic.name ? 'stretch' : 'center',
          justifyContent: selectedTopic.name ? 'flex-end' : 'center',
        }}
      >
        {selectedTopic.name ? (
          <>
            <MessageList />
            <CreateMessage />
          </>
        ) : (
          <Typography variant="h6">
            Create a topic and start messaging!
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default MessagesPage
