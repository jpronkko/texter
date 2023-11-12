import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../graphql/mutations'
import logger from '../utils/logger'
import { GET_MESSAGES } from '../graphql/queries'

const useCreateMessage = () => {
  const [mutation, result] = useMutation(CREATE_MESSAGE, {
    update: (store, response) => {
      const newMessage = response.data.createMessage
      const messagesInStore = store.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
      })
      store.writeQuery({
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
      })
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
    }) //var_object)
    logger.info('Create message result:', createResult)
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
