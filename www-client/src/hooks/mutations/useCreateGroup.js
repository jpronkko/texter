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
    },
    update: (store, response) => {
      const newGroup = response.data.createGroup
      const groupsInStore = store.readQuery({
        query: GET_USER_JOINED_GROUPS,
        variables: { userId: newGroup.ownerId },
      })
      console.log('useCreateGroup: new group', newGroup)
      console.log('useCreateGroup: groups in store', groupsInStore)

      store.writeQuery({
        query: GET_USER_JOINED_GROUPS,
        data: {
          //...groupsInStore,
          variables: { userId: newGroup.ownerId },
          getUserJoinedGroups: {
            userId: newGroup.ownerId,
            joinedGroups: [
              ...groupsInStore.getUserJoinedGroups.joinedGroups,
              {
                __typename: 'JoinedGroup',
                groupId: newGroup.id,
                groupName: newGroup.name,
                description: newGroup.description,
                role: 'OWNER',
              },
            ],
          },
          // getUserJoinedGroups: [
          //   ...groupsInStore.getUserJoinedGroups.joinedGroups,
          //   newGroup,
          // ],
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
