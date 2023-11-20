import React from 'react'
import { useSelector } from 'react-redux'
import useGetTopics from '../../hooks/useGetTopics'
import { Button, Typography } from '@mui/material'

const GroupItem = ({ topic }) => {
  return (
    <div style={{ flexDirection: 'row' }}>
      <Typography variant="h6">{topic.name}</Typography>
      <Button variant="contained">Remove Topic</Button>
    </div>
  )
}

const GroupAmin = () => {
  const group = useSelector((state) => state.selection.group)
  const { topics, error, loading } = useGetTopics(group?.id)
  console.log('group', group, 'topics', topics)

  if (error) {
    return <div>Error: {error}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Typography variant="h4">Group {group.name} Admin</Typography>
      <Button variant="contained">Add Topic</Button>
      {topics.map((item) => (
        <GroupItem
          key={item.id}
          topic={item}
        />
      ))}
    </div>
  )
}

export default GroupAmin
