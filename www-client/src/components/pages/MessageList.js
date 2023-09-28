//import { useEffect, useState } from 'react';
import React from 'react'

import { useSubscription } from '@apollo/client'
import { /*useDispatch,*/ useSelector } from 'react-redux'

import { MESSAGE_ADDED } from '../../graphql/subscriptions'
import useMessages from '../../hooks/useGetMessages'

import { Button, Divider, List } from '@mui/material'
import MessageListItem from '../MessageListItem'
import CreateMessageForm from '../forms/CreateMessageForm'

import logger from '../../utils/logger'
import useCreateMessage from '../../hooks/useCreateMessage'

const MessageList = () => {
  const groupId = useSelector(state => state.selection.groupId)
  const topicId = useSelector(state => state.selection.topicId)

  useSubscription(MESSAGE_ADDED, {
    variables: { groupId: groupId },
    onData: ({ data }) => {
      logger.info('Subsribe add msg', data)
    }
  })

  // const [getMessages, messagesResult] = useQuery(GET_MESSAGES)

  const { messages, loading, error,  } = useMessages(topicId)
  const [createMessage, result] = useCreateMessage()
  //const dispatch = useDispatch()

  /*useEffect(() => {
    if (groupId) {
      getMessages({ variables: { groupId: groupId } })
    }
  }, [groupId])*/

  /*useEffect(() => {
    console.log('New messageResult')
    if (messagesResult && messagesResult.data) {
      const messages = messagesResult.data.getMessages
      if(messages) {
        dispatch(setMessages(messages.map(msg => {
          const { id, body, sentTime } = msg
          return { id, body, sentTime, fromUser: { id: msg.fromUser.id, name: msg.fromUser.name } }
        })))
      }
    }
  }, [messagesResult])*/

  console.log(`group ${JSON.stringify(groupId)}, topic ${JSON.stringify(topicId)}`,
    messages)

  if(loading) {
    return (
      <div>
        Loading ...
      </div>
    )
  }

  if(error) {
    return (
      <div>
        Error Retrieving messages: {JSON.stringify(error)}
      </div>
    )
  }

  const handleClick = () => {
    logger.info('Trying refetch in message list!')
    //refetch()
    logger.info('Data', messages)
  }

  const handleCreate = async (data) => {
    console.log(data, result)
    const message = await createMessage(groupId, data)
    console.log('Message created', message)
    //dispatch(addMessage(message))
  }
  // data.getMessages.map((message) =>
  const renderMessages = messages ? messages.map((message) =>
    <MessageListItem
      key={message.id}
      sender={message.fromUser}
      sentTime={message.sentTime}
      body={message.body}/>) : []

  return (
    <div>
      <List>
        {renderMessages ? renderMessages :'No messages'}
      </List>
      <Button variant="contained" onClick={handleClick}>Test refetch</Button>
      <Divider />
      <CreateMessageForm handleCreate={handleCreate} />
    </div>
  )
}

export default MessageList