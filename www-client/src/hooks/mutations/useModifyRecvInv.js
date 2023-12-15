import { useMutation } from '@apollo/client'

import {
  GET_RECV_INVITATIONS,
  GET_USER_JOINED_GROUPS,
} from '../../graphql/queries'
import { CHANGE_INVITATION_STATUS } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'

const useModifyRecvInv = (/* refetchGroups */) => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_INVITATION_STATUS, {
    onError: (error) => {
      showError(`Modify invitation failed ${error.toString()}`)
      console.log('error', error)
    },
    update: (cache, response) => {
      const modInvitation = response.data.changeInvitationStatus
      console.log('Mutation: Modify Recv Inv Status response: ', modInvitation)
      const result = cache.readQuery({
        query: GET_RECV_INVITATIONS,
      })

      const invitation = result.getReceivedInvitations.find(
        (item) => item.id === modInvitation.id
      )
      console.log('Mutation: Modify Recv Inv Status invitation: ', invitation)

      if (!invitation) {
        console.error(
          'Modify Recv: Invitation not found in cache:',
          modInvitation.id
        )
        return
      }

      cache.modify({
        id: /* cache.identify(invitation) */ `InvitationInfo:${modInvitation.id}`,
        fields: {
          status() {
            return modInvitation.status
          },
        },
      })

      const invitationsInStore = cache.readQuery({
        query: GET_RECV_INVITATIONS,
      })
      console.log(
        'Modinv Recv: invitationsInStore after modify',
        invitationsInStore
      )
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
    const result = changeResult.data?.changeInvitationStatus
    console.log('acceptInvitation result', result)
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
