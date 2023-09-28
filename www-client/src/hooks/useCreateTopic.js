import { useMutation } from '@apollo/client'

import { CREATE_TOPIC } from '../graphql/mutations'
import { GET_TOPICS } from '../graphql/queries'

import logger from '../utils/logger'
import useError from './useErrorMessage'

const useCreateTopic = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_TOPIC, {
    refetchQueries: [{ query: GET_TOPICS }],
    onError: (error) => {
      showError(error.toString())
    },
  })

  const createTopic = async (groupId, name) => {
    logger.info('create topic:', name)
    const createResult = await mutation({ variables: { groupId, name } })
    logger.info('Create topic result:', createResult)
    return createResult.data?.createTopic
  }

  return [createTopic, result]
}

export default useCreateTopic
