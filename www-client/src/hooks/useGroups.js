//import { useLazyQuery } from '@apollo/client'

import { useQuery } from '@apollo/client'
import { GET_USER_JOINED_GROUPS } from '../graphql/queries'

const useGroups = () => {
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_USER_JOINED_GROUPS
  )

  return {
    userGroups: data ? data.getUserJoinedGroups : [],
    loading,
    error,
    refetch,
    ...result,
  }

  /*const [getGroups, { loading , error, data }] = useLazyQuery(GET_USERS_GROUPS)

  return [getGroups, loading, error, data]*/
}

export default useGroups
