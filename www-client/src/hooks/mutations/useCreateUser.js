import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useCreateUser = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_USER, {
    onError: (error) => {
      logger.error('create user error:', error)
      showError(`Create user failed: ${parseError(error)}`)
    },
  })

  const createUser = async (user) => {
    logger.info('create user params', user)
    const createResult = await mutation({
      variables: {
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
        },
      },
    })
    logger.info('Create user result:', createResult)
    return createResult.data?.createUser
  }

  return [createUser, result]
}

export default useCreateUser
