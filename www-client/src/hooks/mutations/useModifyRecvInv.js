import { useMutation } from '@apollo/client'

import {
  GET_RECV_INVITATIONS,
  GET_USER_JOINED_GROUPS,
} from '../../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../../graphql/mutations'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useModifyRecvInv = (/* refetchGroups */) => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      logger.error('Modify invitation failed:', error)
      showError(`Modify invitation failed ${parseError(error)}`)
    },
    update: (cache, response) => {
      const modInvitation = response.data.changeInvitationStatus
      const result = cache.readQuery({
        query: GET_RECV_INVITATIONS,
      })

      const invitation = result.getReceivedInvitations.find(
        (item) => item.id === modInvitation.id
      )

      if (!invitation) {
        logger.error(
          'Modify Recv Inv: Invitation not found in cache:',
          modInvitation.id
        )
        return
      }

      cache.modify({
        id: `InvitationInfo:${modInvitation.id}`,
        fields: {
          status() {
            return modInvitation.status
          },
        },
      })
    },
    refetchQueries: [{ query: GET_USER_JOINED_GROUPS }],
  })

  const acceptInvitation = async (invitationId) => {
    const changeResult = await mutation({
      variables: { invitationId, status: 'ACCEPTED' },
    })
    return changeResult.data?.changeInvitationStatus
  }

  const rejectInvitation = async (invitationId) => {
    const changeResult = await mutation({
      variables: { invitationId, status: 'REJECTED' },
    })
    return changeResult.data?.changeInvitationStatus
  }

  return [acceptInvitation, rejectInvitation, result]
}

export default useModifyRecvInv
