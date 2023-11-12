import React from 'react'
import { Button, Typography } from '@mui/material'
import { AddBox } from '@mui/icons-material'

import useGetTopics from '../hooks/useGetTopics'
import { setTopic } from '../app/selectionSlice'
import { useDispatch, useSelector } from 'react-redux'

import AccordionDetails from './AccordionDetails'

const Topics = ({ group, isOwned, handleCreateTopic, selectGroupOfTopic }) => {
  const { topics, error, loading } = useGetTopics(group?.id)
  const selectedTopic = useSelector((state) => state.selection.topic)
  const dispatch = useDispatch()

  //console.log('group', group, 'topics', topics)

  const handleSelectTopic = async (topic) => {
    dispatch(setTopic(topic))
    selectGroupOfTopic(group)
  }

  const backgroundColor = (item) =>
    selectedTopic?.id === item.id ? '#f0a070' : 'white'

  const renderTopics = () => {
    if (topics) {
      return topics.map((item) => (
        <AccordionDetails
          key={item.id}
          onClick={() => handleSelectTopic(item)}
          style={{ backgroundColor: backgroundColor(item) }}
        >
          # {item.name}
        </AccordionDetails>
      ))
    } else if (loading) {
      return <Typography>Loading...</Typography>
    }
  }

  const renderIfOwned = () => {
    return (
      <Button
        variant="text"
        //startIcon={<AddBox />}
        style={{ justifyContent: 'flex-start' }}
        onClick={handleCreateTopic}
      >
        <Typography>
          {' '}
          <AddBox /> Create topic
        </Typography>
      </Button>
    )
  }

  return (
    <div>
      {error && <Typography>{error}</Typography>}
      {renderTopics()}
      {isOwned && renderIfOwned()}
    </div>
  )
}

export default Topics
