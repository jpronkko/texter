import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'

import { setPassword } from '../../app/userSlice'
import { setMessage } from '../../app/notifySlice'

import { CHANGE_PASSWORD } from '../../graphql/mutations'
import useError from '../ui/useErrorMessage'
import logger from '../../utils/logger'

const useChangePassword = () => {
  const dispatch = useDispatch()

  const [showError] = useError()
  const [mutation, result] = useMutation(CHANGE_PASSWORD, {
    onError: (error) => {
      showError(`Change password failed ${error.toString()}`)
      logger.error('change password error:', error)
    },
    onCompleted: (data) => {
      dispatch(setMessage('Password changed'))
      logger.info('Change password completed:', data)
    },
  })

  const changePassword = async (oldPassword, newPassword) => {
    const changeResult = await mutation({
      variables: { oldPassword, newPassword },
    })

    const texterStorage = JSON.parse(localStorage.getItem('texter-login'))
    texterStorage.password = newPassword
    localStorage.setItem('texter-login', JSON.stringify(texterStorage))
    dispatch(setPassword(newPassword))

    logger.info('change password result:', changeResult)
    return changeResult.data?.changePassword
  }

  return [changePassword, result]
}

export default useChangePassword
