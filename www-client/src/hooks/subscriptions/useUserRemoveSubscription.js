import { useApolloClient, useSubscription } from '@apollo/client'

import { USER_REMOVED_FROM_GROUP } from '../../graphql/subscriptions'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

const useUserRemoveSubsription = (userId) => {
  const apolloClient = useApolloClient()

  const { data, error, loading } = useSubscription(USER_REMOVED_FROM_GROUP, {
    variables: {
      userId: userId,
    },
    onData: ({ data }) => {
      console.log('_______________________')
      console.log(data)
      const removedUserFromGroup = data.data.userRemovedFromGroup
      apolloClient.cache.updateQuery(
        {
          query: GET_USER_JOINED_GROUPS,
          variables: { userId: removedUserFromGroup.userId },
        },
        ({ getUserJoinedGroups }) => {
          console.log('getUserJoinedGroups', getUserJoinedGroups)
          return {
            getUserJoinedGroups: {
              userId: getUserJoinedGroups.userId,
              joinedGroups: getUserJoinedGroups.joinedGroups.filter(
                (item) => item.groupId !== removedUserFromGroup.groupId
              ),
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

export default useUserRemoveSubsription
