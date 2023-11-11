import { useQuery } from "@apollo/client"

import { GET_SENT_INVITATIONS } from "../graphql/queries"

const useSentInvitations = () => {
  const { data, error, loading, fetchMore, refetch, ...result } = useQuery(
    GET_SENT_INVITATIONS
  )

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        after: data.getInvitations,
      },
    })
  }

  return {
    invitations: data?.getSentInvitations,
    fetchMore: handleFetchMore,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useSentInvitations