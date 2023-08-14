import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../graphql/mutations'
import logger from '../utils/logger'

const useCreateMessage = () => {
  const [mutation, result] = useMutation( CREATE_MESSAGE )

  const createMessage = async (groupId, text) => {
    const var_object = { variables: { groupId, text } }
    const createResult = await mutation(var_object) //var_object)
    logger.info('Create message result:', createResult)
    return createResult
  }

  return [createMessage, result]
}

export default useCreateMessage