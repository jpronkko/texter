import React from 'react'
import { useSelector } from 'react-redux'

import CreateMessageForm from './forms/CreateMessageForm'
import useCreateMessage from '../hooks/mutations/useCreateMessage'

const CreateMessage = () => {
  const [createMessage] = useCreateMessage()
  const topic = useSelector((state) => state.selection.topic)

  const handleCreate = async (data) => {
    await createMessage(topic.id, data)
  }

  return <CreateMessageForm handleCreate={handleCreate} />
}

export default CreateMessage
