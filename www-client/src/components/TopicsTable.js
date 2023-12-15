import React, { useRef } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'

import useGetTopics from '../hooks/queries/useGetTopics'
import useRemoveTopic from '../hooks/mutations/useRemoveTopic'
import useTopicsAddedSubscription from '../hooks/subscriptions/useTopicsAddedSubscriptions'
import useTopicRemovedSubscription from '../hooks/subscriptions/useTopicRemovedSubscription'

import ConfirmMessage from './dialogs/ConfirmMessage'

const TopicItem = ({ topic, handleRemoveTopic }) => {
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
        <Typography>Remove</Typography>
      </Button>
    </Box>
  )
}

const TopicsTable = ({ selectedGroup }) => {
  const { topics, error, loading } = useGetTopics(selectedGroup?.id)
  const [removeTopic] = useRemoveTopic()

  useTopicsAddedSubscription(selectedGroup.id)
  useTopicRemovedSubscription(selectedGroup.id)

  const confirmDlgRef = useRef()
  let topicIdToRemove = undefined

  const renderTopics = () => {
    if (topics?.length === 0) {
      return <Typography variant="h6">No topics</Typography>
    } else {
      return topics.map((item) => (
        <TopicItem
          key={item.id}
          topic={item}
          handleRemoveTopic={handleRemoveTopic}
        />
      ))
    }
  }

  const handleRemoveTopic = (topicId) => {
    topicIdToRemove = topicId
    confirmDlgRef.current.open()
  }

  const onOkRemoveTopic = async () => {
    await removeTopic(selectedGroup.id, topicIdToRemove)
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm"
        message="Are you sure you want to remove this topic and its contents?"
        onOk={onOkRemoveTopic}
      />
      <Paper
        elevation={3}
        sx={{ p: 2, pb: 2 }}
      >
        {renderTopics()}
      </Paper>
    </>
  )
}

export default TopicsTable
