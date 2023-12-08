import { useApolloClient, useSubscription } from '@apollo/client'

import { GET_TOPICS } from '../../graphql/queries'

import { TOPIC_REMOVED } from '../../graphql/subscriptions'

const useTopicRemovedSubscription = (groupId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(TOPIC_REMOVED, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log('Receiving removed topic data', data)
      const removedTopic = data.data.topicRemoved
      apolloClient.cache.updateQuery(
        {
          query: GET_TOPICS,
          variables: { groupId: groupId },
          overwrite: true,
        },
        ({ getTopics }) => {
          console.log('Subs: getTopics', getTopics)
          return {
            getTopics: getTopics.filter((item) => item.id !== removedTopic.id),
          }
        }
      )
    },
  })
  return {
    removedTopic: data?.topicRemoved,
    loading,
    error,
  }
}

export default useTopicRemovedSubscription
