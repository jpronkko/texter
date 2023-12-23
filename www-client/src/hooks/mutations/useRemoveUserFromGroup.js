import { useMutation } from '@apollo/client'

import { REMOVE_USER_FROM_GROUP } from '../../graphql/mutations'
import { GET_GROUP_MEMBERS } from '../../graphql/queries'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useRemoveUserFromGroup = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(REMOVE_USER_FROM_GROUP, {
    onError: (error) => {
      logger.error('remove user from group error:', error)
      showError(`Remove user from group failed: ${parseError(error)}`)
    },
    update: (cache, response) => {
      const removedUser = response.data.removeUserFromGroup
      const groupId = removedUser.group
      const userId = removedUser.user

      const userJoinedGroupsInCache = cache.readQuery({
        query: GET_USER_JOINED_GROUPS,
      })

      if (userJoinedGroupsInCache) {
        cache.updateQuery(
          {
            query: GET_USER_JOINED_GROUPS,
            variables: { userId: userId },
            overwrite: true,
          },
          ({ getUserJoinedGroups }) => {
            return {
              getUserJoinedGroups: {
                userId: getUserJoinedGroups.userId,
                joinedGroups: getUserJoinedGroups.joinedGroups.filter(
                  (item) => item.groupId !== groupId
                ),
              },
            }
          }
        )
      }
      const groupMembersInCache = cache.readQuery({ query: GET_GROUP_MEMBERS })
      if (!groupMembersInCache) return

      cache.updateQuery(
        {
          query: GET_GROUP_MEMBERS,
          variables: { groupId: groupId },
          overwrite: true,
        },
        ({ getGroupMembers }) => {
          return {
            getGroupMembers: getGroupMembers.filter(
              (item) => item.id !== userId
            ),
          }
        }
      )
    },
  })

  const removeUserFromGroup = async (userId, groupId) => {
    const removeResult = await mutation({
      variables: { userId, groupId },
    })
    return removeResult.data?.removeUserFromGroup
  }

  return [removeUserFromGroup, result]
}

export default useRemoveUserFromGroup
