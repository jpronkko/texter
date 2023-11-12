import { useMutation } from '@apollo/client'
import { GET_USER_JOINED_GROUPS } from '../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../graphql/mutations'
import useError from './useErrorMessage'

const useModifyRecvInv = (/* refetchGroups */) => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      showError(`Modify invitation failed ${error.toString()}`)
      console.log('error', error)
    },
    update: (store, response) => {
      const modInvitation = response.data.changeInvitationStatus
      console.log('inv update', response)
      store.modify({
        id: `InvitationInfo:${modInvitation.id}`,
        fields: {
          status() {
            return modInvitation.status
          },
        },
      })

      /*const invitationsInStore = store.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: modInvitation.id },
      })
      console.log('invitationsInStore', invitationsInStore)*/
      // refetchGroups()
      /*const recvInvitations = invitationsInStore.getReceivedInvitations
      store.writeQuery({
        query: GET_RECV_INVITATIONS,
        data: {
          variables: { id: modInvitation.id },
          getReceivedInvitations: recvInvitations.map((inv) =>
            inv.id !== modInvitation.id ? inv : modInvitation
          ),
        },
      })
      const invitationsInStore2 = store.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: modInvitation.id },
      })
      console.log('invitationsInStore2', invitationsInStore2)*/
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
