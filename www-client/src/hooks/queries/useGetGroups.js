//import { useLazyQuery } from '@apollo/client'

import { useQuery } from '@apollo/client'

import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'
import logger from '../../utils/logger'
import useError from '../ui/useErrorMessage'

const useGetUserGroups = () => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USER_JOINED_GROUPS,
    {
      onError: (error) => {
        showError(`Get user groups failed ${error.toString()}`)
        logger.error('error', error)
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
    ownedGroups: ownedGroups(),
    joinedGroups: joinedGroups(),
    loading,
    error,
    refetch,
    ...result,
  }

  /*const [getGroups, { loading , error, data }] = useLazyQuery(GET_USERS_GROUPS)

  return [getGroups, loading, error, data]*/
}

export default useGetUserGroups
