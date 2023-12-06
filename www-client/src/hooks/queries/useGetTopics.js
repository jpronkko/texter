import { useQuery } from '@apollo/client'

import { GET_TOPICS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'

const useGetTopics = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(GET_TOPICS, {
    variables: { groupId },
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      showError(`Get topics failed ${error.toString()}`)
      console.log('error', error)
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
