import { useApolloClient, useSubscription } from '@apollo/client'
import { MESSAGE_ADDED_TO_TOPIC } from '../graphql/subscriptions'
import { GET_MESSAGES } from '../graphql/queries'

const useMsgSubsription = (topicId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(MESSAGE_ADDED_TO_TOPIC, {
    variables: {
      topicId: topicId,
    },
    onData: ({ data }) => {
      console.log('onData -> ', data)
      const newMessage = data.data.messageAddedToTopic
      const msgsInCache = apolloClient.cache.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: topicId },
      })

      console.log('newMessage -> ', newMessage, 'msgsInCache', msgsInCache)

      if (msgsInCache.getMessages.find((item) => item.id === newMessage.id)) {
        console.log('Msg alreafy in cache', newMessage)
        return
      }
      apolloClient.cache.writeQuery({
        query: GET_MESSAGES,
        data: {
          variables: { topicId: topicId },
          getMessages: msgsInCache.getMessages.concat({
            __typename: 'MessageInfo',
            id: newMessage.id,
            body: newMessage.body,
            sentTime: newMessage.sentTime,
            fromUser: newMessage.fromUser,
            topicId: newMessage.topicId,
          }),
        },
      })

      const msgsInCache2 = apolloClient.cache.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: topicId },
      })

      console.log('msgsInCache2', msgsInCache2)
      /* apolloClient.cache.updateQuery(
        { query: GET_MESSAGES, variables: { topicId: topicId } },
        ({ messageAddedToTopic }) => {
          return {
            messageAddedToTopic: messageAddedToTopic.concat(newMessage),
          }
        }
      ) */
    },
  })

  return {
    messages: data?.getMessages,
    loading,
    error,
  }
}

export default useMsgSubsription
