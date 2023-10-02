import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../graphql/mutations'
import logger from '../utils/logger'
import { GET_MESSAGES } from '../graphql/queries'

const useCreateMessage = () => {
  /*const updateCache = (cache, { data }) => {
    console.log('Got data to update cache', data, console.log(GET_MESSAGES))
  }*/

  /*const [mutation, result] = useMutation(CREATE_MESSAGE, {
    update: updateCache,
  })*/

  const [mutation, result] = useMutation(CREATE_MESSAGE, {
    update: (cache, response) => {
      cache.updateQuery(
        {
          query: GET_MESSAGES,
          variables: { topicId: '651557fc3e3cf5f6f0c6f8b9' },
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
      )
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
      groupId: topicId,
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
