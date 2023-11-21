import { useMutation } from '@apollo/client'
import { REMOVE_USER_FROM_GROUP } from '../graphql/mutations'
import logger from '../utils/logger'

const useRemoveUserFromGroup = () => {
  const [mutation, result] = useMutation(REMOVE_USER_FROM_GROUP)

  const removeUserFromGroup = async (userId, groupId) => {
    logger.info('remove user from group params', groupId, userId)
    const removeResult = await mutation({
      variables: { userId, groupId },
    })
    logger.info('remove user from group result:', removeResult)
    return removeResult.data.removeUserFromGroup
  }

  return [removeUserFromGroup, result]
}

export default useRemoveUserFromGroup
