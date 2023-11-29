//import { useLazyQuery } from '@apollo/client'

import { useQuery, useSubscription } from '@apollo/client'
import { GET_USER_JOINED_GROUPS } from '../graphql/queries'
import { USER_ADDED_TO_GROUP } from '../graphql/subscriptions'
import logger from '../utils/logger'
import useError from './useErrorMessage'

const useGetUserGroups = (userId) => {
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

  useSubscription(USER_ADDED_TO_GROUP, {
    variables: {
      userId: userId,
    },
    onData: ({ data }) => {
      console.log('_______________________')
      logger.info(data)
    },
  })

  const getIdAndName = (groups) =>
    groups.map((g) => ({
      id: g.groupId,
      name: g.groupName,
      description: g.description,
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
