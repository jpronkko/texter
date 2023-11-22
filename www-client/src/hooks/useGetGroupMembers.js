import { useQuery } from '@apollo/client'

import { GET_GROUP_MEMBERS } from '../graphql/queries'

const useGetGroupMembers = (groupId) => {
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_GROUP_MEMBERS,
    {
      variables: {
        groupId: groupId,
      },
      onError: (error) => {
        console.log('error', error)
      },
    }
  )

  return {
    members: data?.getGroupMembers,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useGetGroupMembers
