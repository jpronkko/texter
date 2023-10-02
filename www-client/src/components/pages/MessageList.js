//import { useEffect, useState } from 'react';
import React from 'react'

import { useSubscription } from '@apollo/client'
import { /*useDispatch,*/ useSelector } from 'react-redux'

import { MESSAGE_ADDED } from '../../graphql/subscriptions'
import useMessages from '../../hooks/useGetMessages'

import { Button, Divider, List, Typography } from '@mui/material'
import MessageListItem from '../MessageListItem'
import CreateMessageForm from '../forms/CreateMessageForm'

import logger from '../../utils/logger'
import useCreateMessage from '../../hooks/useCreateMessage'

const MessageList = () => {
  const group = useSelector((state) => state.selection.group)
  const topic = useSelector((state) => state.selection.topic)

  useSubscription(MESSAGE_ADDED, {
    variables: { groupId: group.id },
    onData: ({ data }) => {
      logger.info('Subsribe add msg', data)
    },
  })

  // const [getMessages, messagesResult] = useQuery(GET_MESSAGES)

  const { messages, loading, error } = useMessages(topic.id)
  const [createMessage, result] = useCreateMessage()
  //const dispatch = useDispatch()

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

  const handleClick = () => {
    logger.info('Trying refetch in message list!')
    //refetch()
    logger.info('Data', messages)
  }

  const handleCreate = async (data) => {
    console.log(data, result)
    const message = await createMessage(topic.id, data)
    console.log('Message created', message)
    //dispatch(addMessage(message))
  }
  // data.getMessages.map((message) =>
  const renderMessages = messages
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
    <div>
      <Typography>Message List</Typography>
      <List>{renderMessages ? renderMessages : 'No messages'}</List>
      <Button
        variant="contained"
        onClick={handleClick}
      >
        Test refetch
      </Button>
      <Divider />
      <CreateMessageForm handleCreate={handleCreate} />
    </div>
  )
}

export default MessageList
