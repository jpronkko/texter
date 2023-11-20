import { useQuery, useSubscription } from '@apollo/client'

import { GET_TOPICS } from '../graphql/queries'
import { TOPIC_ADDED_TO_GROUP } from '../graphql/subscriptions'
import useError from './useErrorMessage'

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

  useSubscription(TOPIC_ADDED_TO_GROUP, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log('data', data)
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
