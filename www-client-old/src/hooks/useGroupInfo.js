import { useLazyQuery } from '@apollo/client'
import { GET_USERS_GROUPS } from '../graphql/queries'

const useGroupInfo = () => {
  const [getGroups, { loading , error, data }] = useLazyQuery(GET_USERS_GROUPS)

  return [getGroups, loading, error, data]
}

export default useGroupInfo