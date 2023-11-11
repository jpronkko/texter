import { useQuery, useSubscription } from '@apollo/client'

import { GET_TOPICS } from '../graphql/queries'
import { TOPIC_ADDED_TO_GROUP } from '../graphql/subscriptions'

const useGetTopics = (groupId) => {
  const { data, error, loading, refetch, ...result } = useQuery(GET_TOPICS, {
    variables: { groupId },
    // fetchPolicy: 'cache-and-network',
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
