import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'

import { CREATE_USER } from '../../graphql/mutations'
import { logIn } from '../../app/userSlice'
import { setLoginData } from '../../utils/loginData'
import useNotifyMessage from '../ui/useNotifyMessage'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useCreateUser = () => {
  const dispatch = useDispatch()
  const [showError] = useError()
  const [showMessage] = useNotifyMessage()
  const [mutation, result] = useMutation(CREATE_USER, {
    onError: (error) => {
      logger.error('Create user failed:', error)
      showError(`Create user failed: ${parseError(error)}`)
    },
    onCompleted: (data) => {
      showMessage(`${data.createUser?.username} has logged in!`)
    },
  })

  const createUser = async (user) => {
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
    const loginData = createResult.data?.createUser
    if (!loginData) {
      return null
    }

    setLoginData(loginData)
    dispatch(logIn(loginData))

    return loginData
  }

  return [createUser, result]
}

export default useCreateUser
