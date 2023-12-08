import { useApolloClient, useSubscription } from '@apollo/client'

import { GET_TOPICS } from '../../graphql/queries'
import { TOPIC_ADDED_TO_GROUP } from '../../graphql/subscriptions'

const useTopicsAddedSubscription = (groupId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(TOPIC_ADDED_TO_GROUP, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log('Receiving new topics data', data)
      const newTopic = data.data.topicAddedToGroup
      apolloClient.cache.updateQuery(
        {
          query: GET_TOPICS,
          variables: { groupId: groupId },
        },
        ({ getTopics }) => {
          console.log('Subs: getTopics', getTopics)
          return {
            getTopics: getTopics.concat(newTopic),
          }
        }
      )
    },
  })
  return {
    newTopics: data?.getTopics,
    loading,
    error,
  }
}

export default useTopicsAddedSubscription
