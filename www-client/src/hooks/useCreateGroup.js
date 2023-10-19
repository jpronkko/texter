import { useMutation } from '@apollo/client'

import { CREATE_GROUP } from '../graphql/mutations'
import logger from '../utils/logger'
import useError from './useErrorMessage'

const useCreateGroup = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_GROUP, {
    onError: (error) => {
      showError(error.toString())
    },
  })

  const createGroup = async (name) => {
    logger.info('create group object:', name)
    const createResult = await mutation({ variables: { name } }) //var_object)
    logger.info('Create group result:', createResult)
    return createResult.data?.createGroup
  }

  return [createGroup, result]
}

export default useCreateGroup
