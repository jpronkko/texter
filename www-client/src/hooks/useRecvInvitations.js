import { useApolloClient, useQuery, useSubscription } from '@apollo/client'

import { GET_RECV_INVITATIONS } from '../graphql/queries'
import { INVITATION_ADDED } from '../graphql/subscriptions'
import logger from '../utils/logger'

const useRecvInvitations = (userId) => {
  const apolloClient = useApolloClient()
  const { data, error, loading, fetchMore, refetch, ...result } =
    useQuery(GET_RECV_INVITATIONS)

  const foo = useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      logger.info('onData -> ', data)
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

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        after: data.getReceivedInvitations,
      },
    })
  }

  return {
    recvInvitations: data?.getReceivedInvitations,
    fetchMore: handleFetchMore,
    loading,
    error,
    refetch,
    foo,
    ...result,
  }
}

export default useRecvInvitations
