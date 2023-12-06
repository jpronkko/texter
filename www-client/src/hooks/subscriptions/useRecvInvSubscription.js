import { useApolloClient, useSubscription } from '@apollo/client'

import { INVITATION_ADDED } from '../../graphql/subscriptions'
import { GET_RECV_INVITATIONS } from '../../graphql/queries'

const useRecvInvSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      console.log('_______________________')
      console.log(data)
      const newInvitation = data.data.invitationAdded
      apolloClient.cache.updateQuery(
        { query: GET_RECV_INVITATIONS, variables: { toUserId: userId } },
        ({ getReceivedInvitations }) => {
          console.log('update query getMessages', getReceivedInvitations)
          return {
            getReceivedInvitations:
              getReceivedInvitations.concat(newInvitation),
          }
        }
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
