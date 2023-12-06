//import { useLazyQuery } from '@apollo/client'

import { useQuery } from '@apollo/client'

import { GET_USERS_NOT_IN_GROUP } from '../../graphql/queries'
import logger from '../../utils/logger'
import useError from '../ui/useErrorMessage'

const useGetUsersNotInGroup = (groupId) => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USERS_NOT_IN_GROUP,
    {
      variables: { groupId },
      skip: !groupId,
      onError: (error) => {
        showError(`Getting users failed: ${error.toString()}`)
        logger.error('error', error)
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
