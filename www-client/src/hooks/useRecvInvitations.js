import { useQuery, useSubscription } from '@apollo/client'

import { GET_RECV_INVITATIONS } from '../graphql/queries'
import { INVITATION_ADDED } from '../graphql/subscriptions'
import logger from '../utils/logger'

const useRecvInvitations = (userId) => {
  const { data, error, loading, fetchMore, refetch, ...result } =
    useQuery(GET_RECV_INVITATIONS)

  useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      logger.info(data)
    },
  })

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        after: data.getInvitations,
      },
    })
  }

  return {
    recvInvitations: data?.getReceivedInvitations,
    fetchMore: handleFetchMore,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useRecvInvitations
