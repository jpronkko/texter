//import { useEffect, useState } from 'react';
import React, { useEffect } from 'react'

import { useLazyQuery, useSubscription } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'

import { MESSAGE_ADDED } from '../../graphql/subscriptions'
import { GET_MESSAGES } from '../../graphql/queries'

import { Button, Divider, List } from '@mui/material'
import MessageListItem from '../MessageListItem'
import CreateMessageForm from '../forms/CreateMessageForm'
import { addMessage, setMessages } from '../../app/groupSlice'

import logger from '../../utils/logger'
import useCreateMessage from '../../hooks/useCreateMessage'

const MessageList = () => {
  const groupId = useSelector(state => state.group.id)
  const groupMessages = useSelector(state => state.messages.messages)

  useSubscription(MESSAGE_ADDED, {
    variables: { groupId: groupId },
    onData: ({ data }) => {
      logger.info('Subsribe add msg', data)
    }
  })

  const [getMessages, messagesResult] = useLazyQuery(GET_MESSAGES)

  const [createMessage, result] = useCreateMessage()
  const dispatch = useDispatch()

  useEffect(() => {
    if (groupId) {
      getMessages({ variables: { groupId: groupId } })
    }
  }, [groupId])

  useEffect(() => {
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
  }, [messagesResult])

  console.log(`group ${JSON.stringify(groupId)}, messageResult`,
    messagesResult.data, 'group Msg:', groupMessages)

  if(messagesResult.loading) {
    return (
      <div>
        Loading ...
      </div>
    )
  }

  if(messagesResult.error) {
    return (
      <div>
        Error: {JSON.stringify(messagesResult.error)}
      </div>
    )
  }

  const handleClick = () => {
    logger.info('Trying refetch in message list!')
    //refetch()
    logger.info('Data', messagesResult.data)
  }

  const handleCreate = async (data) => {
    console.log(data, result)
    const message = await createMessage(groupId, data)
    dispatch(addMessage(message))
  }
  // data.getMessages.map((message) =>
  const messages = groupMessages ? groupMessages.map((message) =>
    <MessageListItem
      key={message.id}
      sender={message.fromUser}
      sentTime={message.sentTime}
      body={message.body}/>) : []

  return (
    <div>
      <List>
        {messages ? messages :'No messages'}
      </List>
      <Button variant="contained" onClick={handleClick}>Test refetch</Button>
      <Divider />
      <CreateMessageForm handleCreate={handleCreate} />
    </div>
  )
}

export default MessageList