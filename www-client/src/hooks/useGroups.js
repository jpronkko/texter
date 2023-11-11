//import { useLazyQuery } from '@apollo/client'

import { useQuery, useSubscription } from '@apollo/client'
import { GET_USER_JOINED_GROUPS } from '../graphql/queries'
import { USER_ADDED_TO_GROUP } from '../graphql/subscriptions'
import logger from '../utils/logger'

const useGetUserGroups = () => {
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USER_JOINED_GROUPS
  )

  useSubscription(USER_ADDED_TO_GROUP, {
    onData: ({ data }) => {
      logger.info(data)
    },
  })

  const joinedGroups = () => {
    if (data)
      return data.getUserJoinedGroups.joinedGroups.map((g) => ({
        id: g.groupId,
        name: g.groupName,
      }))
    return []
  }

  return {
    userGroups: joinedGroups(),
    loading,
    error,
    refetch,
    ...result,
  }

  /*const [getGroups, { loading , error, data }] = useLazyQuery(GET_USERS_GROUPS)

  return [getGroups, loading, error, data]*/
}

export default useGetUserGroups
