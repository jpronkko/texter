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
      const joinedGroups = data.data.userRemovedFromGroup.joinedGroups

      apolloClient.cache.updateQuery(
        {
          query: GET_USER_JOINED_GROUPS,
          variables: { userId: joinedGroups.userId },
          overwrite: true,
        },
        ({ getUserJoinedGroups }) => {
          return {
            getUserJoinedGroups: {
              __typename: 'JoinedGroupInfo',
              userId: getUserJoinedGroups.userId,
              joinedGroups,
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
