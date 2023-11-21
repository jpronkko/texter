import { useMutation } from '@apollo/client'
import { CHANGE_EMAIL } from '../graphql/mutations'
import useError from './useErrorMessage'
import logger from '../utils/logger'

const useChangeEmail = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_EMAIL, {
    onError: (error) => {
      showError(`Change email failed ${error.toString()}`)
      logger.error('change email error:', error)
    },
  })

  const changeEmail = async (email) => {
    const changeResult = await mutation({
      variables: {
        email,
      },
    })
    logger.info('change email result:', changeResult)
    return changeResult.data?.changeEmail
  }

  return [changeEmail, result]
}

export default useChangeEmail
