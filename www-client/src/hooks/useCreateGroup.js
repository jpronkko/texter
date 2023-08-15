import { useMutation } from '@apollo/client'

import { CREATE_GROUP } from '../graphql/mutations'
import logger from '../utils/logger'

const useCreateGroup = () => {
  const [mutation, result] = useMutation( CREATE_GROUP )

  const createGroup = async (name) => {
    const var_object = { variables: { name } }
    logger.info('create group object', var_object)
    const createResult = await mutation(name) //var_object)
    logger.info('Create group result:', createResult)
    return createResult
  }

  return [createGroup, result]
}

export default useCreateGroup