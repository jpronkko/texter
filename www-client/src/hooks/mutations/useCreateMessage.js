import { useMutation } from '@apollo/client'

import { CREATE_MESSAGE } from '../../graphql/mutations'
import { GET_MESSAGES } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useCreateMessage = () => {
  const [showError] = useError()

  const [mutation, result] = useMutation(CREATE_MESSAGE, {
    onError: (error) => {
      showError(`Create message failed ${error.toString()}`)
      logger.error('Create message error:', error)
    },
    update: (store, response) => {
      const newMessage = response.data.createMessage
      const messagesInStore = store.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
      })
      console.log('-------------------')
      console.log('Search messages in store with topic id', newMessage.topicId)
      console.log('messages in store', messagesInStore)
      /*store.writeQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
        data: {
          getMessages: [
            ...messagesInStore.getMessages,
            {
              __typename: 'MessageInfo',
              id: newMessage.id,
              topicId: newMessage.topicId,
              body: newMessage.body,
              fromUser: newMessage.fromUser,
              sentTime: newMessage.sentTime,
            },
          ],
        },
      })*/
      /*cache.updateQuery(
        {
          query: GET_MESSAGES,
          //  variables: { topicId },
        },
        (data) => {
          if (data) {
            console.log('updating', response, data?.getMessages)
            return {
              getMessages: data?.getMessages?.concat(
                response.data.createMessage
              ),
            }
          }
          console.log('data undefined! response', response)
        }
      )*/
    },
  })

  const createMessage = async (topicId, body) => {
    console.log(`group id ${topicId}, body: ${body}`)
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
/*
  update: (cache, response) => {
      cache.updateQuery({ query: GET_MESSAGES }, ({ getMessages }) => {
        console.log('updating', response, data)
        return {
          getMessages: data.getMessages.concat(response.data.createMessage),
        }
      })
    },
  */
