import { useMutation } from '@apollo/client'
import { CREATE_INVITATION } from '../../graphql/mutations'
import {
  GET_SENT_INVITATIONS,
  GET_USERS_NOT_IN_GROUP,
} from '../../graphql/queries'

import { uniqueById } from '../../utils/uniqById'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const updateCache = (cache, query, newInvitation) => {
  cache.updateQuery(query, ({ getSentInvitations }) => {
    return {
      getSentInvitations: uniqueById([newInvitation, ...getSentInvitations]),
    }
  })
}

const useCreateInvitation = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_INVITATION, {
    onError: (error) => {
      logger.error('create invitation error:', error)
      showError(`Create invitation failed ${parseError(error)}`)
    },

    update: (cache, response) => {
      updateCache(
        cache,
        { query: GET_SENT_INVITATIONS },
        response.data.createInvitation
      )
    },
    refetchQueries: [{ query: GET_USERS_NOT_IN_GROUP }],
  })

  const createInvitation = async (fromUserId, groupId, toUser) => {
    const createResult = await mutation({
      variables: {
        invitation: {
          fromUserId,
          toUser,
          groupId,
        },
      },
    })
    return createResult.data?.createInvitation
  }

  return [createInvitation, result]
}

export default useCreateInvitation
