import { useApolloClient, useSubscription } from '@apollo/client'

import { INVITATION_STATUS_CHANGED } from '../../graphql/subscriptions'
import logger from '../../utils/logger'

const useInvStatusSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading } = useSubscription(INVITATION_STATUS_CHANGED, {
    variables: { userId },
    onData: ({ data }) => {
      const updatedInvitation = data.data.invitationStatusChanged
      logger.info('useInvStatusSubscription-----')
      logger.info('Subs Inv Status data: Receiving inv data', updatedInvitation)

      // Change invitation status irrespective of the query (GET_RECV_INVITATIONS or GET_SENT_INVITATIONS)
      apolloClient.cache.modify({
        id: `InvitationInfo:${updatedInvitation.id}`,
        fields: {
          status() {
            return updatedInvitation.status
          },
        },
      })
    },
  })
  return {
    updatedInvitations: data?.invitationStatusChanged,
    loading,
    error,
  }
}

export default useInvStatusSubscription
