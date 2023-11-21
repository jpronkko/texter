import { useMutation } from '@apollo/client'
import { CHANGE_PASSWORD } from '../graphql/mutations'
import useError from './useErrorMessage'
import logger from '../utils/logger'

const useChangePassword = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_PASSWORD, {
    onError: (error) => {
      showError(`Change password failed ${error.toString()}`)
      logger.error('change password error:', error)
    },
  })

  const changePassword = async (password, newPassword) => {
    const changeResult = await mutation({
      variables: { password, newPassword },
    })
    logger.info('change password result:', changeResult)
    return changeResult.data?.changePassword
  }

  return [changePassword, result]
}

export default useChangePassword
