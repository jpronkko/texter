import React from 'react'
import { Button, Typography } from '@mui/material'
import { AddBox } from '@mui/icons-material'

import useGetTopics from '../hooks/useGetTopics'
import { setTopic } from '../app/selectionSlice'
import { useDispatch, useSelector } from 'react-redux'

import AccordionDetails from './AccordionDetails'

const Topics = ({ group, handleCreateTopic, selectGroupOfTopic }) => {
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

  console.log(
    'group',
    group,
    'topics',
    topics,
    'error',
    error,
    'loading',
    loading
  )

  const renderTopics = () => {
    if (topics) {
      return topics.map((item) => (
        <AccordionDetails
          key={item.id}
          onClick={() => handleSelectTopic(item)}
          style={{ backgroundColor: backgroundColor(item) }}
        >
          {item.name}
        </AccordionDetails>
      ))
    } else if (loading) {
      return <Typography>Loading...</Typography>
    }
  }

  return (
    <div>
      {renderTopics()}
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
    </div>
  )
}

export default Topics
