import { useQuery } from '@apollo/client'

import { GET_MESSAGES } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useMessages = (topicId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(GET_MESSAGES, {
    variables: { topicId: topicId },
    skip: !topicId,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      logger.error('Getting messages failed:', error)
      showError(`Getting messages failed: ${parseError(error)}!`)
    },
  })

  return {
    messages: data?.getMessages,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useMessages
