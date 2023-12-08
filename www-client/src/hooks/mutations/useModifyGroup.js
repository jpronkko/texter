import { useMutation } from '@apollo/client'
import useError from '../ui/useErrorMessage'
import { MODIFY_GROUP } from '../../graphql/mutations'
import logger from '../../utils/logger'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

const useModifyGroup = (userId) => {
  const [showError] = useError()
  const [mutation, result] = useMutation(MODIFY_GROUP, {
    onError: (error) => {
      showError(`Modify group failed: ${error.toString()}`)
      logger.error('modify group error:', error)
    },
    update: (store, response) => {
      const modifiedGroup = response.data.modifyGroup
      const joinedGroupInfo = store.readQuery({
        query: GET_USER_JOINED_GROUPS,
        variables: { userId },
      })
      console.log('-------------------')
      console.log('Search groups in store with user id', userId)
      console.log('groups in store', joinedGroupInfo)
      console.log('modified group', modifiedGroup)
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
      console.log('updated groups', updatedGroups)
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
    logger.info(
      'modify group',
      groupId,
      'name',
      name,
      'description',
      description
    )
    const modifyResult = await mutation({
      variables: { groupId, name, description },
    })
    logger.info('modify group result:', modifyResult)
    return modifyResult.data?.modifyGroup
  }

  return [modifyGroup, result]
}

export default useModifyGroup
