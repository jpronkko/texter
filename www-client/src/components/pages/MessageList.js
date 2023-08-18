//import { useEffect, useState } from 'react';
import React from 'react'

import { Button, List } from '@mui/material'
import MessageListItem from '../MessageListItem'

import { useQuery, useSubscription } from '@apollo/client'

import logger from '../../utils/logger'
import { MESSAGE_ADDED } from '../../graphql/subscriptions'
import { GET_MESSAGES } from '../../graphql/queries'
import { useSelector } from 'react-redux'


const MessageList = () => {
  useSubscription(MESSAGE_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })

  const group = useSelector(state => state.group)
  const { loading, data, error, refetch } = useQuery(GET_MESSAGES, { variables: { groupId:  group.id } })

  console.log('group', group)

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
        Error: {JSON.stringify(error)}
      </div>
    )
  }
  const handleClick = () => {
    logger.info('Trying refetch!')
    refetch()
  }
  const messages = data.getMessages.map((message) =>
    <MessageListItem
      key={message.id}
      sender={message.sender}
      sentTime={message.sentTime}
      body={message.body}/>)
  return (
    <div>
      <List>
        {messages}
      </List>
      <Button variant="contained" onClick={handleClick}>Test refetch</Button>
    </div>
  )
}

export default MessageList