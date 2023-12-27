import { useQuery } from '@apollo/client'

import { GET_RECV_INVITATIONS } from '../../graphql/queries'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useRecvInvitations = () => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_RECV_INVITATIONS,
    {
      onError: (error) => {
        logger.error('Get sent invitations error:', error)
        showError(parseError(error))
      },
    }
  )

  return {
    recvInvitations: data?.getReceivedInvitations,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useRecvInvitations
