import { useApolloClient, useSubscription } from '@apollo/client'

import { INVITATION_ADDED } from '../../graphql/subscriptions'
import { GET_RECV_INVITATIONS } from '../../graphql/queries'
import useNotifyMessage from '../ui/useNotifyMessage'

const useRecvInvSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const [showMessage] = useNotifyMessage()
  const { data, error, loading } = useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      console.log('_______________________')
      console.log(data)
      const newInvitation = data.data.invitationAdded
      const invitationsInCache = apolloClient.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: newInvitation.id, toUserId: userId },
      })
      console.log('invitationsInCache', invitationsInCache)
      apolloClient.cache.updateQuery(
        {
          query: GET_RECV_INVITATIONS,
          variables: { id: newInvitation.id, toUserId: userId },
        },
        ({ getReceivedInvitations }) => {
          console.log('update get invitations', getReceivedInvitations)
          return {
            getReceivedInvitations:
              getReceivedInvitations.concat(newInvitation),
          }
        }
      )

      const invitationsInCache2 = apolloClient.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: newInvitation.id, toUserId: userId },
      })

      console.log('invitationsInCache', invitationsInCache2)
      showMessage(
        `New invitation reveived from ${newInvitation.fromUser.username}`
      )
    },
  })

  return {
    recvInvitations: data?.getReceivedInvitations,
    error,
    loading,
  }
}

export default useRecvInvSubscription
