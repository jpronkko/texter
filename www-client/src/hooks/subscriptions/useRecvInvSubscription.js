import { useApolloClient, useSubscription } from '@apollo/client'

import { INVITATION_ADDED } from '../../graphql/subscriptions'
import { GET_RECV_INVITATIONS } from '../../graphql/queries'
import useNotifyMessage from '../ui/useNotifyMessage'
import logger from '../../utils/logger'

const updateCache = (cache, query, newInvitation) => {
  const uniqueById = (items) => {
    let seen = new Set()
    return items.filter((item) => {
      let id = item.id
      return seen.has(id) ? false : seen.add(id)
    })
  }

  let hasNewInvitation = false

  cache.updateQuery(query, ({ getReceivedInvitations }) => {
    logger.info(
      'update get invitations query',
      query,
      ' getReceivedInvitations: ',
      getReceivedInvitations
    )
    const newInvitations = uniqueById([
      newInvitation,
      ...getReceivedInvitations,
    ])

    hasNewInvitation = getReceivedInvitations.length !== newInvitations.length
    return {
      getReceivedInvitations: newInvitations,
    }
  })

  return hasNewInvitation
}

const useRecvInvSubscription = (userId) => {
  const apolloClient = useApolloClient()
  const [showMessage] = useNotifyMessage()
  const { data, error, loading } = useSubscription(INVITATION_ADDED, {
    variables: {
      toUserId: userId,
    },
    onData: ({ data }) => {
      const pendingInvitation = data.data.invitationAdded
      logger.info('Subs Inv data: Receiving new inv data', pendingInvitation)
      const hasNewInvitation = updateCache(
        apolloClient.cache,
        { query: GET_RECV_INVITATIONS },
        pendingInvitation
      )

      if (hasNewInvitation) {
        showMessage(
          `New invitation reveived from ${pendingInvitation.fromUser.username}`
        )
      }
      /*  console.log('_______________________')
      console.log(data)
      const newInvitation = data.data.invitationAdded
      const invitationsInCache = apolloClient.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: newInvitation.id, toUserId: userId },
      })
      console.log('invitationsInCache', invitationsInCache)
      apolloClient.cache.updateQuery(
        {
          query: GET_RECV_INVITATIONS,
          variables: { id: newInvitation.id, toUserId: userId },
        },
        ({ getReceivedInvitations }) => {
          console.log('update get invitations', getReceivedInvitations)
          return {
            getReceivedInvitations:
              getReceivedInvitations.concat(newInvitation),
          }
        }
      )

      const invitationsInCache2 = apolloClient.readQuery({
        query: GET_RECV_INVITATIONS,
        variables: { id: newInvitation.id, toUserId: userId },
      })

      console.log('invitationsInCache', invitationsInCache2)
      showMessage(
        `New invitation reveived from ${newInvitation.fromUser.username}`
      ) */
    },
  })

  return {
    recvInvitations: data?.getReceivedInvitations,
    error,
    loading,
  }
}

export default useRecvInvSubscription
