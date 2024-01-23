import { useQuery } from '@apollo/client'

import { GET_GROUP_MEMBERS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useGetGroupMembers = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_GROUP_MEMBERS,
    {
      variables: {
        groupId: groupId,
      },
      onError: (error) => {
        logger.error('Get group members failed:', error)
        showError(`Get group members failed: ${parseError(error)}`)
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
