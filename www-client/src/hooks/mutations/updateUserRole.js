import { useMutation } from '@apollo/client'

import { GET_USER_JOINED_GROUPS } from '../../graphql/queries'
import { UPDATE_USER_ROLE } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useUpdateUserRole = () => {
  const [mutation, result] = useMutation(UPDATE_USER_ROLE)
  const [showError] = useError()

  const updateUserRole = async (userId, groupId, role) => {
    const updateResult = await mutation({
      variables: { userId, groupId, role },
      onError: (error) => {
        showError(`Update user role failed: ${error.toString()}`)
        logger.error('updateUserRole error:', error)
      },
      update: (store, response) => {
        const updatedUserRole = response.data.updateUserRole
        console.log('-> useUpdateUserRole: updated user role', updatedUserRole)

        const joinedGroupInfo = store.readQuery({
          query: GET_USER_JOINED_GROUPS,
          variables: { userId: updatedUserRole.user },
        })
        console.log(
          'useUpdateUserRole: groups in store',
          joinedGroupInfo.getUserJoinedGroups.joinedGroups
        )
        const updatedJoinedGroups =
          joinedGroupInfo.getUserJoinedGroups.joinedGroups.map((group) => {
            if (group.groupId === updatedUserRole.groupId) {
              return {
                ...group,
                role: updatedUserRole.role,
              }
            } else {
              return group
            }
          })
        console.log(
          'useUpdateUserRole: updated joined groups',
          updatedJoinedGroups
        )
        store.writeQuery({
          query: GET_USER_JOINED_GROUPS,
          data: {
            variables: { userId: updatedUserRole.user },
            getUserJoinedGroups: {
              __typename: 'JoinedGroupInfo',
              userId: updatedUserRole.user,
              joinedGroups: updatedJoinedGroups,
            },
          },
        })
      },
    })
    return updateResult.data?.updateUserRole
  }

  return [updateUserRole, result]
}

export default useUpdateUserRole
