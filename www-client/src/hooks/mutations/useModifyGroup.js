import { useMutation } from '@apollo/client'
import { MODIFY_GROUP } from '../../graphql/mutations'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useModifyGroup = (userId) => {
  const [showError] = useError()
  const [mutation, result] = useMutation(MODIFY_GROUP, {
    onError: (error) => {
      logger.error('modify group failed:', error)
      showError(`Modify group failed: ${parseError(error)}`)
    },
    update: (store, response) => {
      const modifiedGroup = response.data.modifyGroup
      const joinedGroupInfo = store.readQuery({
        query: GET_USER_JOINED_GROUPS,
        variables: { userId },
      })
      const updatedGroups =
        joinedGroupInfo.getUserJoinedGroups.joinedGroups.map((item) => {
          if (item.groupId === modifiedGroup.id) {
            return {
              ...item,
              groupName: modifiedGroup.name,
              description: modifiedGroup.description,
            }
          } else {
            return item
          }
        })

      store.writeQuery({
        query: GET_USER_JOINED_GROUPS,
        data: {
          variables: { userId },
          getUserJoinedGroups: {
            __typename: 'JoinedGroupInfo',
            userId,
            joinedGroups: updatedGroups,
          },
        },
      })
    },
  })

  const modifyGroup = async (groupId, name, description) => {
    const modifyResult = await mutation({
      variables: { groupId, name, description },
    })
    return modifyResult.data?.modifyGroup
  }

  return [modifyGroup, result]
}

export default useModifyGroup
