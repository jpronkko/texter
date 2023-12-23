import { useMutation } from '@apollo/client'

import {
  GET_SENT_INVITATIONS,
  GET_USERS_NOT_IN_GROUP,
} from '../../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useModifySentInv = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      logger.error('Modify invitation failed:', error)
      showError(`Modify invitation failed ${parseError(error)}`)
    },
    update: (cache, response) => {
      const modifiedInvitation = response.data.changeInvitationStatus
      const result = cache.readQuery({
        query: GET_SENT_INVITATIONS,
        variables: { id: modifiedInvitation.id },
      })

      const invitation = result.getSentInvitations.find(
        (item) => item.id === modifiedInvitation.id
      )

      if (!invitation) {
        logger.error(
          'Modify Sent: Invitation not found in cache:',
          modifiedInvitation.id
        )
        return
      }

      cache.modify({
        id: `InvitationInfo:${invitation.id}`,
        fields: {
          status() {
            return modifiedInvitation.status
          },
        },
      })
    },
    refetchQueries: [{ query: GET_USERS_NOT_IN_GROUP }],
  })

  const cancelInvitation = async (invitationId) => {
    const changeResult = await mutation({
      variables: { invitationId, status: 'CANCELLED' },
    })
    return changeResult.data?.changeInvitationStatus
  }

  return [cancelInvitation, result]
}

export default useModifySentInv
