import React, { useEffect, useRef } from 'react'

import { useSelector } from 'react-redux'
import { List, Typography } from '@mui/material'

import useMessages from '../hooks/queries/useGetMessages'
import useMessageSubsription from '../hooks/subscriptions/useMessageSubsription'

import MessageListItem from './MessageListItem'
import Loading from './Loading'

const useScrollToBottom = (ref) => {
  const scrollToBottom = () => {
    if (!ref.current) return
    ref.current.style.scrollBehavior = 'smooth'
    ref.current.scrollTop = ref.current.scrollHeight
  }

  return {
    scrollToBottom,
  }
}

const MessageList = () => {
  const topic = useSelector((state) => state.selection.topic)

  const { messages, loading } = useMessages(topic.id)
  useMessageSubsription(topic.id)

  const ref = useRef()
  const { scrollToBottom } = useScrollToBottom(ref)

  useEffect(() => {
    scrollToBottom()
  }, [messages, topic])

  if (loading) {
    return <Loading />
  }

  if (!messages || messages.length === 0) {
    return (
      <div>
        <Typography variant="h6">No messages yet</Typography>
      </div>
    )
  }

  const renderedMessages = messages
    ? messages.map((message) => (
        <MessageListItem
          id="message-list-item"
          key={message.id}
          sender={message.fromUser}
          sentTime={message.sentTime}
          body={message.body}
        />
      ))
    : []

  return (
    <List
      ref={ref}
      sx={{
        maxHeight: '100%',
        overflow: 'auto',
      }}
    >
      {renderedMessages ? renderedMessages : 'No messages'}
    </List>
  )
}

export default MessageList
