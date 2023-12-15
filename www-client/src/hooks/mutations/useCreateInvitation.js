import { useMutation } from '@apollo/client'
import { CREATE_INVITATION } from '../../graphql/mutations'
import {
  GET_SENT_INVITATIONS,
  GET_USERS_NOT_IN_GROUP,
} from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'
import { parseError } from '../../utils/parseError'

const updateCache = (cache, query, newInvitation) => {
  const uniqueById = (items) => {
    let seen = new Set()
    return items.filter((item) => {
      let id = item.id
      return seen.has(id) ? false : seen.add(id)
    })
  }

  cache.updateQuery(query, ({ getSentInvitations }) => {
    logger.info(
      'update get invitations query',
      query,
      ' getSentInvitaitons: ',
      getSentInvitations
    )
    return {
      getSentInvitations: uniqueById([newInvitation, ...getSentInvitations]),
    }
  })
}

const useCreateInvitation = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_INVITATION, {
    onError: (error) => {
      showError(`Create invitation failed ${parseError(error)}`)
      logger.error('create invitation error:', error)
    },

    update: (cache, response) => {
      logger.info('create invitation update', response)
      updateCache(
        cache,
        { query: GET_SENT_INVITATIONS },
        response.data.createInvitation
      )
    },
    refetchQueries: [{ query: GET_USERS_NOT_IN_GROUP }],
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
