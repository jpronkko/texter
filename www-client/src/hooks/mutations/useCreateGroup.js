import { useMutation } from '@apollo/client'

import { CREATE_GROUP } from '../../graphql/mutations'
import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'

import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useCreateGroup = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_GROUP, {
    onError: (error) => {
      showError(error.toString())
      logger.error('create group error:', error)
    },
    update: (store, response) => {
      // There is only one JoinedGroupInfo per userId in the store.
      // Update that object with the new group.
      const newGroup = response.data.createGroup
      const joinedGroupInfo = store.readQuery({
        query: GET_USER_JOINED_GROUPS,
        variables: { userId: newGroup.ownerId },
      })
      console.log('useCreateGroup: new group', newGroup)
      console.log('useCreateGroup: groups in store', joinedGroupInfo)

      store.writeQuery({
        query: GET_USER_JOINED_GROUPS,
        data: {
          variables: { userId: newGroup.ownerId },
          getUserJoinedGroups: {
            __typename: 'JoinedGroupInfo',
            userId: newGroup.ownerId,
            joinedGroups: [
              ...joinedGroupInfo.getUserJoinedGroups.joinedGroups,
              {
                __typename: 'JoinedGroup',
                groupId: newGroup.id,
                groupName: newGroup.name,
                description: newGroup.description,
                role: 'OWNER',
              },
            ],
          },
        },
      })
    },
  })

  const createGroup = async (name, description) => {
    logger.info('create group:', name, description)
    const createResult = await mutation({ variables: { name, description } }) //var_object)
    logger.info('Create group result:', createResult)
    return createResult.data?.createGroup
  }

  return [createGroup, result]
}

export default useCreateGroup
