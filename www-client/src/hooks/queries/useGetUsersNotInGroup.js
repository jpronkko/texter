import { useQuery } from '@apollo/client'

import { GET_USERS_NOT_IN_GROUP } from '../../graphql/queries'
import logger from '../../utils/logger'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'

const useGetUsersNotInGroup = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USERS_NOT_IN_GROUP,
    {
      variables: { groupId },
      skip: !groupId,
      onError: (error) => {
        logger.error('Getting users not in group failed', error)
        showError(`Getting users not in group failed: ${parseError(error)}`)
      },
    }
  )

  const getUsers = () => {
    if (data) {
      const users = data.getUsersNotInGroup
      return users
    }
    return []
  }

  return {
    users: getUsers(),
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useGetUsersNotInGroup
