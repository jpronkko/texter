import { useApolloClient, useSubscription } from '@apollo/client'

import { MESSAGE_ADDED_TO_TOPIC } from '../../graphql/subscriptions'
import { GET_MESSAGES } from '../../graphql/queries'

const useMessageSubsription = (topicId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(MESSAGE_ADDED_TO_TOPIC, {
    variables: {
      topicId: topicId,
    },
    onData: ({ data }) => {
      console.log('onData -> ', data)
      const newMessage = data.data.messageAddedToTopic
      const msgsInCache = apolloClient.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
      })

      if (msgsInCache.getMessages.find((item) => item.id === newMessage.id)) {
        console.log('Msg alreafy in cache', newMessage)
        return
      }

      apolloClient.cache.updateQuery(
        { query: GET_MESSAGES, variables: { topicId: newMessage.topicId } },
        ({ getMessages }) => {
          console.log('update query getMessages', getMessages)
          return {
            getMessages: getMessages.concat(newMessage),
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
