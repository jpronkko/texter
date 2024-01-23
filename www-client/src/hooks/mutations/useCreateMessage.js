import { useMutation } from '@apollo/client'

import { CREATE_MESSAGE } from '../../graphql/mutations'
import { GET_MESSAGES } from '../../graphql/queries'

import { uniqueById } from '../../utils/uniqById'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useCreateMessage = () => {
  const [showError] = useError()

  const [mutation, result] = useMutation(CREATE_MESSAGE, {
    onError: (error) => {
      logger.error('Create message error:', error)
      showError(`Create message failed ${parseError(error)}`)
    },
    update: (store, response) => {
      const newMessage = response.data.createMessage
      const messagesInStore = store.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
      })

      const message = {
        __typename: 'MessageInfo',
        id: newMessage.id,
        topicId: newMessage.topicId,
        body: newMessage.body,
        fromUser: newMessage.fromUser,
        sentTime: newMessage.sentTime,
      }

      store.writeQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
        data: {
          getMessages: uniqueById(messagesInStore.getMessages.concat(message)),
        },
      })
    },
  })

  const createMessage = async (topicId, body) => {
    const createResult = await mutation({
      variables: { messageInput: { topicId, body } },
    })
    logger.info('Create message result:', createResult)

    if (!createResult.data?.createMessage) {
      return null
    }

    return {
      id: createResult.data.createMessage.id,
      fromUser: createResult.data.createMessage.fromUser,
      sentTime: createResult.data.createMessage.sentTime,
      topicId,
      body,
    }
  }

  return [createMessage, result]
}

export default useCreateMessage
