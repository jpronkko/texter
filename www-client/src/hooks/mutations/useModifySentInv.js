import { useMutation } from '@apollo/client'

import {
  GET_SENT_INVITATIONS,
  GET_USERS_NOT_IN_GROUP,
} from '../../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useModifySentInv = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      showError(`Modify invitation failed ${error.toString()}`)
      console.log('error', error)
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
      console.log('Modify Sent: invitation: ', invitation)
      if (!invitation) {
        logger.error(
          'Modify Sent: Invitation not found in cache:',
          modifiedInvitation.id
        )
        return
      }

      cache.modify({
        id: cache.identify(invitation), //`InvitationInfo:${modInvitation.id}`,
        fields: {
          status() {
            return modifiedInvitation.status
          },
        },
      })
      const invitationsInStore = cache.readQuery({
        query: GET_SENT_INVITATIONS,
        variables: { id: modifiedInvitation.id },
        //variables: { userId: modInvitation.toUserId },
      })
      console.log('SENT_INVITATIONS invitationsInStore', invitationsInStore)
      /* store.writeQuery({
        query: GET_SENT_INVITATIONS,
        data: {
          variables: { id: modInvitation.id },
          //variables: { userId: modInvitation.toUserId },
          getInvitations: invitationsInStore.getInvitations.map((inv) =>
            inv.id !== modInvitation.id ? inv : modInvitation
          ),
        },
      }) */
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
