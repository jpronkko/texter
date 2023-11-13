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
      const msgsInCache = apolloClient.readQuery({
        query: GET_MESSAGES,
        variables: { topicId: newMessage.topicId },
      })

      console.log(
        'Subscription to topicId',
        topicId,
        'newMessage -> ',
        newMessage,
        'msgsInCache',
        msgsInCache
      )

      if (msgsInCache.getMessages.find((item) => item.id === newMessage.id)) {
        console.log('Msg alreafy in cache', newMessage)
        return
      }

      msgsInCache.getMessages.forEach((item) =>
        console.log(
          'item',
          item,
          'newmesf',
          newMessage.id,
          item.id === newMessage.id
        )
      )

      // const res = apolloClient.writeQuery({
      //   query: GET_MESSAGES,
      //   data: {
      //     variables: { topicId: topicId },
      //     getMessages: [
      //       ...msgsInCache.getMessages,
      //       {
      //         __typename: 'MessageInfo',
      //         id: newMessage.id,
      //         body: newMessage.body,
      //         sentTime: newMessage.sentTime,
      //         fromUser: newMessage.fromUser,
      //         topicId: newMessage.topicId,
      //       },
      //     ],
      //   },
      // })
      //
      //const res = apolloClient.writeQuery({
      //  query: GET_MESSAGES,
      //  data: {
      //    getMessages: [
      //      ...msgsInCache.getMessages,
      //      {
      //        __typename: 'MessageInfo',
      //        id: newMessage.id,
      //        body: newMessage.body,
      //        sentTime: newMessage.sentTime,
      //        fromUser: newMessage.fromUser,
      //        topicId: newMessage.topicId,
      //      },
      //    ],
      //    variables: { topicId: newMessage.topicId },
      //  },
      //})

      // const res = apolloClient.cache.modify({
      //   id: apolloClient.cache.identify(msgsInCache),
      //   fields: {
      //     getMessages(existingMessages = []) {
      //       const newMessageRef = apolloClient.cache.writeFragment({
      //         data: newMessage,
      //         fragment: GET_MESSAGES,
      //       })
      //       return [...existingMessages, newMessageRef]
      //     },
      //   },
      // })

      // console.log('res', res)

      // const msgsInCache2 = apolloClient.cache.readQuery({
      //   query: GET_MESSAGES,
      //   variables: { topicId: topicId },
      // })

      // console.log(
      //   'msgsInCache2',
      //   msgsInCache2.getMessages.forEach((item) => console.log('item', item))
      //)
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

export default useMsgSubsription
