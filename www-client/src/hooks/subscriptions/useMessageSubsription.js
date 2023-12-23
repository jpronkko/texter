import { useApolloClient, useSubscription } from '@apollo/client'

import { MESSAGE_ADDED_TO_TOPIC } from '../../graphql/subscriptions'
import { GET_MESSAGES } from '../../graphql/queries'
import { uniqueById } from '../../utils/uniqById'

const useMessageSubsription = (topicId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(MESSAGE_ADDED_TO_TOPIC, {
    variables: {
      topicId: topicId,
    },
    onData: ({ data }) => {
      const newMessage = data.data.messageAddedToTopic

      apolloClient.cache.updateQuery(
        { query: GET_MESSAGES, variables: { topicId: newMessage.topicId } },
        ({ getMessages }) => {
          return {
            getMessages: uniqueById(getMessages.concat(newMessage)),
          }
        }
      )
    },
  })

  return {
    messages: data?.getMessages,
    loading,
    error,
  }
}

export default useMessageSubsription
