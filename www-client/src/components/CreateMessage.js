import React from 'react'
import { useSelector } from 'react-redux'

import CreateMessageForm from './forms/CreateMessageForm'
import useCreateMessage from '../hooks/useCreateMessage'

const CreateMessage = () => {
  const [createMessage, result] = useCreateMessage()
  const topic = useSelector((state) => state.selection.topic)

  const handleCreate = async (data) => {
    console.log(data, result)
    const message = await createMessage(topic.id, data)
    console.log('Message created', message)
    //dispatch(addMessage(message))
  }

  return <CreateMessageForm handleCreate={handleCreate} />
}

export default CreateMessage
