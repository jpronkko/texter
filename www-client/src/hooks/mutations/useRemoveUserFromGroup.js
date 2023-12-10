import { useMutation } from '@apollo/client'

import { REMOVE_USER_FROM_GROUP } from '../../graphql/mutations'
import { GET_GROUP_MEMBERS } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useRemoveUserFromGroup = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(REMOVE_USER_FROM_GROUP, {
    onError: (error) => {
      logger.error('remove user from group error:', error)
      showError(`Remove user from group failed: ${error.toString()}`)
    },
    update: (store, response) => {
      const removedUser = response.data.removeUserFromGroup
      const groupId = removedUser.group
      const userId = removedUser.user

      const groupMembers = store.readQuery({
        query: GET_GROUP_MEMBERS,
        variables: { groupId },
      })
      logger.info('remove user from group update', removedUser)
      logger.info('group members in store', groupMembers)
      const updatedMembers = groupMembers.getGroupMembers.filter(
        (member) => member.id !== userId
      )
      logger.info('updated group members', updatedMembers)
      store.writeQuery({
        query: GET_GROUP_MEMBERS,
        data: {
          variables: { groupId },
          getGroupMembers: updatedMembers,
        },
      })
      logger.info(
        'group members in store after update',
        store.readQuery({
          query: GET_GROUP_MEMBERS,
          variables: { groupId },
        })
      )
    },
  })

  const removeUserFromGroup = async (userId, groupId) => {
    logger.info('remove user from group params', groupId, userId)
    const removeResult = await mutation({
      variables: { userId, groupId },
    })
    logger.info('remove user from group result:', removeResult)
    return removeResult.data?.removeUserFromGroup
  }

  return [removeUserFromGroup, result]
}

export default useRemoveUserFromGroup
