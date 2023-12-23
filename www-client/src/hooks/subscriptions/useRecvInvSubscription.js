import { useApolloClient, useSubscription } from '@apollo/client'

import { INVITATION_ADDED } from '../../graphql/subscriptions'
import { GET_RECV_INVITATIONS } from '../../graphql/queries'
import useNotifyMessage from '../ui/useNotifyMessage'
import { uniqueById } from '../../utils/uniqById'

const updateCache = (cache, query, newInvitation) => {
  let hasNewInvitation = false

  cache.updateQuery(query, ({ getReceivedInvitations }) => {
    const newInvitations = uniqueById([
      newInvitation,
      ...getReceivedInvitations,
    ])

    hasNewInvitation = getReceivedInvitations.length !== newInvitations.length
    return {
      getReceivedInvitations: newInvitations,
    }
  })

  return hasNewInvitation
}

const useRecvInvSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const [showMessage] = useNotifyMessage()
  const { data, error, loading } = useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      const pendingInvitation = data.data.invitationAdded
      const hasNewInvitation = updateCache(
        apolloClient.cache,
        { query: GET_RECV_INVITATIONS },
        pendingInvitation
      )

      if (hasNewInvitation) {
        showMessage(
          `New invitation reveived from ${pendingInvitation.fromUser.username}`
        )
      }
    },
  })

  return {
    recvInvitations: data?.getReceivedInvitations,
    error,
    loading,
  }
}

export default useRecvInvSubscription
