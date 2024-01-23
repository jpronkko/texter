import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Typography } from '@mui/material'
import { AddBox } from '@mui/icons-material'

import { setTopic } from '../app/selectionSlice'
import useGetTopics from '../hooks/queries/useGetTopics'

import AccordionDetails from './AccordionDetails'
import Loading from './Loading'

const Topics = ({ group, isOwned, handleCreateTopic, selectGroupOfTopic }) => {
  const { topics, error, loading } = useGetTopics(group?.id)
  const dispatch = useDispatch()

  const handleSelectTopic = async (topic) => {
    dispatch(setTopic(topic))
    selectGroupOfTopic(group)
  }

  const renderTopics = () => {
    if (topics) {
      return topics.map((item) => (
        <AccordionDetails
          key={item.id}
          onClick={() => handleSelectTopic(item)}
        >
          # {item.name}
        </AccordionDetails>
      ))
    } else if (loading) {
      return <Loading />
    }
  }

  const renderIfOwned = () => {
    return (
      <Button
        variant="text"
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
