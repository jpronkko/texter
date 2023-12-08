import { useApolloClient, useSubscription } from '@apollo/client'

import { GET_SENT_INVITATIONS } from '../../graphql/queries'
import { GET_RECV_INVITATIONS } from '../../graphql/queries'
import { INVITATION_STATUS_CHANGED } from '../../graphql/subscriptions'

const useInvStatusSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(INVITATION_STATUS_CHANGED, {
    variables: { userId },
    onData: ({ data }) => {
      console.log('Receiving new inv data', data)
      const invUpdated = data.data.invitationStatusChanged
      apolloClient.cache.updateQuery(
        {
          query: GET_SENT_INVITATIONS,
          variables: { id: invUpdated.id },
        },
        ({ getSentInvitations }) => {
          return {
            getSentInvitations: getSentInvitations.map((inv) => {
              if (inv.id === invUpdated.id) {
                return invUpdated
              } else {
                return inv
              }
            }),
          }
        }
      )
      apolloClient.cache.updateQuery(
        {
          query: GET_RECV_INVITATIONS,
          variables: { id: invUpdated.id },
        },
        ({ getRecvInvitations }) => {
          return {
            getSentInvitations: getRecvInvitations.map((inv) => {
              if (inv.id === invUpdated.id) {
                return invUpdated
              } else {
                return inv
              }
            }),
          }
        }
      )
    },
  })
  return {
    updatedInvitations: data?.invitationStatusChanged,
    loading,
    error,
  }
}

export default useInvStatusSubscription
