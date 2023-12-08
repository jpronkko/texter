import { useMutation } from '@apollo/client'

import {
  GET_SENT_INVITATIONS,
  GET_USERS_NOT_IN_GROUP,
} from '../../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'

const useModifySentInv = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      showError(`Modify invitation failed ${error.toString()}`)
      console.log('error', error)
    },
    update: (store, response) => {
      const modInvitation = response.data.changeInvitationStatus
      store.modify({
        id: `InvitationInfo:${modInvitation.id}`,
        fields: {
          status() {
            return modInvitation.status
          },
        },
      })
      console.log('inv update', response)
      const invitationsInStore = store.readQuery({
        query: GET_SENT_INVITATIONS,
        variables: { id: modInvitation.id },
        //variables: { userId: modInvitation.toUserId },
      })
      console.log('invitationsInStore', invitationsInStore)
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
