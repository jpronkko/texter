import { useMutation } from '@apollo/client'

import useError from '../ui/useErrorMessage'
import { REMOVE_TOPIC } from '../../graphql/mutations'
import logger from '../../utils/logger'

const useRemoveTopic = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(REMOVE_TOPIC, {
    onError: (error) => {
      showError(`Remove topic failed: ${error.toString()}`)
      logger.error('remove topic error:', error)
    },
  })

  const removeTopic = async (groupId, topicId) => {
    logger.info('remove topic', topicId, 'groupId', groupId)
    const removeResult = await mutation({
      variables: { groupId, topicId },
      onError: (error) => {
        showError(`Remove topic failed: ${error.toString()}`)
        logger.error('remove topic error:', error)
      },
    })
    logger.info('remove user from group result:', removeResult)
    return removeResult.data?.removeTopic
  }

  return [removeTopic, result]
}

export default useRemoveTopic
