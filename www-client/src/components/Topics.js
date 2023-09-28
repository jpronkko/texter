import React from 'react'
import { Button, Typography } from '@mui/material'
import { AddBox } from '@mui/icons-material'

import useTopics from '../hooks/useTopics'
import { setTopic } from '../app/selectionSlice'
import { useDispatch } from 'react-redux'

import AccordionDetails from './AccordionDetails'

const Topics = ({ groupId, handleCreateTopic }) => {
  const { topics } = useTopics(groupId)
  const dispatch = useDispatch()

  console.log('topics', topics)

  const handleSelectTopic = async (topic) => {
    dispatch(setTopic(topic))
  }

  const renderTopics = () => {
    if (topics) {
      return topics.map((item) => (
        <AccordionDetails
          key={item.id}
          label={'# ' + item.name}
          onClick={() => handleSelectTopic(item.id)}
        >
          {item.name}
        </AccordionDetails>
      ))
    }
  }

  return (
    <div>
      {renderTopics()}
      <Button
        variant="text"
        startIcon={<AddBox />}
        style={{ justifyContent: 'flex-start' }}
        onClick={handleCreateTopic}
      >
        <Typography>Create topic</Typography>
      </Button>
    </div>
  )
}

export default Topics
