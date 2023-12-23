import { useMutation } from '@apollo/client'

import { REMOVE_TOPIC } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useRemoveTopic = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(REMOVE_TOPIC, {
    onError: (error) => {
      logger.error('Remove topic failed:', error)
      showError(`Remove topic failed: ${parseError(error)}`)
    },
  })

  const removeTopic = async (groupId, topicId) => {
    const removeResult = await mutation({
      variables: { groupId, topicId },
      onError: (error) => {
        showError(`Remove topic failed: ${error.toString()}`)
        logger.error('remove topic error:', error)
      },
    })
    return removeResult.data?.removeTopic
  }

  return [removeTopic, result]
}

export default useRemoveTopic
