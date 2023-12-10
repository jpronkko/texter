import { useQuery } from '@apollo/client'

import { GET_GROUP_MEMBERS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'

const useGetGroupMembers = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_GROUP_MEMBERS,
    {
      variables: {
        groupId: groupId,
      },
      onError: (error) => {
        showError(`Get group members failed: ${error.toString()}`)
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
