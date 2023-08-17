//import { useEffect, useState } from 'react';
import React from 'react'

import { Button, List } from '@mui/material'
import MessageListItem from '../MessageListItem'

import { useQuery, useSubscription } from '@apollo/client'

import logger from '../../utils/logger'
import { MESSAGE_ADDED } from '../../graphql/subscriptions'
import { GET_MESSAGES } from '../../graphql/queries'


const MessageList = () => {
  useSubscription(MESSAGE_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })

  const { loading, data, error, refetch } = useQuery(GET_MESSAGES)

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
        Error {JSON.stringify(error)}
      </div>
    )
  }
  const handleClick = () => {
    logger.info('Trying refetch!')
    refetch()
  }
  const messages = data.getMessages.map((message) =>
    <MessageListItem  key={message.id} sender={message.sender} text={message.body}/>)
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