import { useQuery } from '@apollo/client'

import { GET_RECV_INVITATIONS } from '../../graphql/queries'

const useRecvInvitations = () => {
  const { data, error, loading, fetchMore, refetch, ...result } =
    useQuery(GET_RECV_INVITATIONS)

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
    ...result,
  }
}

export default useRecvInvitations
