import { useMutation } from '@apollo/client'
import { GET_RECV_INVITATIONS } from '../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../graphql/mutations'
import useError from './useErrorMessage'

const useModifyInvitations = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      showError(`Modify invitation failed ${error.toString()}`)
      console.log('error', error)
    },
    update: (store, response) => {
      const modInvitation = response.data.changeInvitationStatus
      const invitationsInStore = store.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: modInvitation.id },
        //variables: { userId: modInvitation.toUserId },
      })
      store.writeQuery({
        query: GET_RECV_INVITATIONS,
        data: {
          variables: { id: modInvitation.id },
          //variables: { userId: modInvitation.toUserId },
          getInvitations: invitationsInStore.getInvitations.map((inv) =>
            inv.id !== modInvitation.id ? inv : modInvitation
          ),
        },
      })
    },
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

  const cancelInvitation = async (invitationId) => {
    const changeResult = await mutation({
      variables: { invitationId, status: 'CANCELLED' },
    })
    return changeResult.data?.changeInvitationStatus
  }

  return [acceptInvitation, rejectInvitation, cancelInvitation, result]
}

export default useModifyInvitations
