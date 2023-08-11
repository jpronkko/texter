import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../graphql/mutations'
import logger from '../utils/logger'

const useCreateUser = () => {
  const [createUserMutation, result] = useMutation( CREATE_USER )

  const createUser = async (user) => {
    const var_object = { variables: { user: user } }
    logger.info('create mut object', var_object)
    const createResult = await createUserMutation(var_object)
    logger.info('Create user result:', createResult)
    return createResult
  }

  return [createUser, result]
}

export default useCreateUser