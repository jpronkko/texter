import { useQuery } from '@apollo/client'

import { GET_TOPICS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useGetTopics = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(GET_TOPICS, {
    variables: { groupId },
    onError: (error) => {
      logger.error('Getting topics failed: ', error)
      showError(`Getting topics failed: ${parseError(error)}`)
    },
  })

  return {
    topics: data?.getTopics,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useGetTopics
