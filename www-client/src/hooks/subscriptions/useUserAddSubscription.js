import { useApolloClient, useSubscription } from '@apollo/client'

import { USER_ADDED_TO_GROUP } from '../../graphql/subscriptions'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

const useUserAddSubsription = (userId) => {
  const apolloClient = useApolloClient()

  const { data, error, loading } = useSubscription(USER_ADDED_TO_GROUP, {
    variables: {
      userId: userId,
    },
    onData: ({ data }) => {
      console.log('_______________________')
      console.log(data)
      const newUserToGroup = data.data.userAddedToGroup
      apolloClient.cache.updateQuery(
        {
          query: GET_USER_JOINED_GROUPS,
          variables: { userId: newUserToGroup.userId },
        },
        ({ getUserJoinedGroups }) => {
          console.log('getUserJoinedGroups', getUserJoinedGroups)
          return {
            getUserJoinedGroups: {
              userId: getUserJoinedGroups.userId,
              joinedGroups:
                getUserJoinedGroups.joinedGroups.concat(newUserToGroup),
            },
          }
        }
      )
    },
  })

  return {
    userGroups: data,
    error,
    loading,
  }
}

export default useUserAddSubsription
