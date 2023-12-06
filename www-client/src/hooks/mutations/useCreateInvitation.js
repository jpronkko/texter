import { useMutation } from '@apollo/client'
import { CREATE_INVITATION } from '../../graphql/mutations'
import { GET_SENT_INVITATIONS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useCreateInvitation = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_INVITATION, {
    onError: (error) => {
      showError(`Create invitation failed ${error.toString()}`)
      logger.error('create invitation error:', error)
    },

    update: (store, response) => {
      const newInvitation = response.data.createInvitation
      const invitationsInStore = store.readQuery({
        query: GET_SENT_INVITATIONS,
        variables: {
          id: newInvitation.id,
          // fromUserId: newInvitation.fromUserId,
          // toUserId: newInvitation.toUserId,
        },
      })
      store.writeQuery({
        query: GET_SENT_INVITATIONS,
        data: {
          // There is only one invitation per invitation id in the store
          variables: {
            __typename: 'Invitation',
            id: newInvitation.id,
            // fromUserId: newInvitation.fromUserId,
            // toUserId: newInvitation.toUserId,
          },
          getSentInvitations:
            invitationsInStore.getSentInvitations.concat(newInvitation),
        },
      })
    },
  })

  const createInvitation = async (fromUserId, groupId, toUser) => {
    console.log('createInvitation', fromUserId, groupId, toUser)
    const createResult = await mutation({
      variables: {
        invitation: {
          fromUserId,
          toUser,
          groupId,
        },
      },
    })
    logger.info('Create invitation result:', createResult)
    return createResult.data?.createInvitation
  }

  return [createInvitation, result]
}

export default useCreateInvitation
