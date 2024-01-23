import { useQuery } from '@apollo/client'

import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useGetUserGroups = () => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USER_JOINED_GROUPS,
    {
      onError: (error) => {
        logger.error('Get user groups failed', error)
        showError(`Get user groups failed ${parseError(error)}`)
      },
    }
  )

  const getIdAndName = (groups) =>
    groups.map((g) => ({
      id: g.groupId,
      name: g.groupName,
      description: g.description,
      role: g.role,
    }))

  const ownedGroups = () => {
    if (data) {
      const groups = data.getUserJoinedGroups.joinedGroups
      return getIdAndName(groups.filter((g) => g.role === 'OWNER'))
    }
    return []
  }

  const joinedGroups = () => {
    if (data) {
      const groups = data.getUserJoinedGroups.joinedGroups
      return getIdAndName(groups.filter((g) => g.role !== 'OWNER'))
    }
    return []
  }

  return {
    allGroups: data ? getIdAndName(data.getUserJoinedGroups.joinedGroups) : [],
    ownedGroups: ownedGroups(),
    joinedGroups: joinedGroups(),
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useGetUserGroups
