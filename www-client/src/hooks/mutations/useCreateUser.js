import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../../graphql/mutations'
import logger from '../../utils/logger'

const useCreateUser = () => {
  const [mutation, result] = useMutation(CREATE_USER)

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
    return { ...user, ...createResult.data.createUser }
  }

  return [createUser, result]
}

export default useCreateUser
