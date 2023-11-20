//import { useEffect, useState } from 'react';
import React from 'react'

import { useSelector } from 'react-redux'

import useMessages from '../../hooks/useGetMessages'

import { Container, Divider, List } from '@mui/material'

import MessageListItem from '../MessageListItem'

import useMsgSubsription from '../../hooks/useMsgSubsription'

const MessageList = () => {
  const group = useSelector((state) => state.selection.group)
  const topic = useSelector((state) => state.selection.topic)

  const { messages, loading, error } = useMessages(topic.id)
  const newLocal = useMsgSubsription(topic.id)
  console.log(' -> ', newLocal.messages, newLocal.loading, newLocal.error)

  console.log(
    `message list: group ${JSON.stringify(group.id)}, topic ${JSON.stringify(
      topic.id
    )}`,
    messages
  )

  if (loading) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Error Retrieving messages: {JSON.stringify(error)}</div>
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
    <Container>
      {/* <List sx={{ minHeight: '100%', overflow: 'auto' }}></List> */}
      <List>{renderedMessages ? renderedMessages : 'No messages'}</List>
      <Divider sx={{ mb: 2.5 }} />
    </Container>
  )
}

export default MessageList

{
  /* <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        bgcolor: 'background.default',
        padding: '10px',
      }}
    > */
}
