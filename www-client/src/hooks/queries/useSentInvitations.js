import { useQuery } from '@apollo/client'

import { GET_SENT_INVITATIONS } from '../../graphql/queries'

const useSentInvitations = () => {
  const { data, error, loading, refetch, ...result } =
    useQuery(GET_SENT_INVITATIONS)

  return {
    sentInvitations: data ? data.getSentInvitations : [],

    loading,
    error,
    refetch,
    ...result,
  }
}

export default useSentInvitations
