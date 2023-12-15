//import { useEffect, useState } from 'react';
import React from 'react'

import { useSelector } from 'react-redux'
import { Box, Divider, List } from '@mui/material'

import useMessages from '../hooks/queries/useGetMessages'
import useMessageSubsription from '../hooks/subscriptions/useMessageSubsription'

import MessageListItem from './MessageListItem'

const MessageList = () => {
  const topic = useSelector((state) => state.selection.topic)

  const { messages, loading, error } = useMessages(topic.id)
  useMessageSubsription(topic.id)

  if (loading) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Error Retrieving messages: {JSON.stringify(error)}</div>
  }

  if (!messages || messages.length === 0) {
    return <div>No messages yet</div>
  }

  const renderedMessages = messages
    ? messages.map((message) => (
        <MessageListItem
          key={message.id}
          sender={message.fromUser}
          sentTime={message.sentTime}
          body={message.body}
        />
      ))
    : []

  return (
    <Box sx={{ m: 1 }}>
      {/* <List sx={{ minHeight: '100%', overflow: 'auto' }}></List> */}
      <List sx={{ backgroundColor: '#606060' }}>
        {renderedMessages ? renderedMessages : 'No messages'}
      </List>
      <Divider sx={{ m: 2 }} />
    </Box>
  )
}

export default MessageList
