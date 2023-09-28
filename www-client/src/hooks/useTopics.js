import { useQuery } from '@apollo/client'

import { GET_TOPICS } from '../graphql/queries'

const useTopics = (groupId) => {
  const { data, error, loading, refetch, ...result } = useQuery(GET_TOPICS, {
    variables: { groupId },
    // skip: groupId ? false : true,
    fetchPolicy: 'cache-and-network',
  })

  return {
    topics: data?.getTopics,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useTopics
