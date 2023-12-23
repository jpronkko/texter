import { useQuery } from '@apollo/client'

import { GET_SENT_INVITATIONS } from '../../graphql/queries'
import logger from '../../utils/logger'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'

const useSentInvitations = () => {
  const [showError] = useError()
  const { data, error, loading, refetch, ...result } = useQuery(
    GET_SENT_INVITATIONS,
    {
      onError: (error) => {
        logger.error('get sent invitations error:', error)
        showError(parseError(error))
      },
    }
  )

  return {
    invitations: data?.getSentInvitations,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useSentInvitations
