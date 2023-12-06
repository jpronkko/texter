import { useApolloClient } from '@apollo/client'
import { useSubscription } from '@apollo/react-hooks'

import { GET_TOPICS } from '../../graphql/queries'
import { TOPIC_ADDED_TO_GROUP } from '../../graphql/subscriptions'

const useTopicsSubscription = (groupId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(TOPIC_ADDED_TO_GROUP, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log('data', data)
      const newTopic = data.data.topicAddedToGroup
      apolloClient.cache.updateQuery(
        {
          query: GET_TOPICS,
          variables: { groupId: groupId },
        },
        ({ getTopics }) => {
          console.log('getTopics', getTopics)
          return {
            getTopics: getTopics.concat(newTopic),
          }
        }
      )
    },
  })
  return {
    topics: data?.getTopics,
    loading,
    error,
  }
}

export default useTopicsSubscription
