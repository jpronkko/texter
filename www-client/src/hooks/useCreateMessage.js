import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../graphql/mutations'
import logger from '../utils/logger'

const useCreateMessage = () => {
  const [mutation, result] = useMutation( CREATE_MESSAGE )

  const createMessage = async (groupId, body) => {
    console.log(`group id ${groupId}, body: ${body}`)
    const createResult = await mutation({ variables: { messageInput: { groupId, body } } }) //var_object)
    logger.info('Create message result:', createResult)
    return {
      id: createResult.data.createMessage.id,
      fromUser: createResult.data.createMessage.fromUser,
      sentTime: createResult.data.createMessage.sentTime,
      groupId,
      body }
  }

  return [createMessage, result]
}

export default useCreateMessage