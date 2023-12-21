import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'

import { setEmail } from '../../app/userSlice'
import { setMessage } from '../../app/notifySlice'

import { CHANGE_EMAIL } from '../../graphql/mutations'

import useError from '../ui/useErrorMessage'
import { parseError } from '../../utils/parseError'
import logger from '../../utils/logger'

const useChangeEmail = () => {
  const dispatch = useDispatch()
  const [showError] = useError()

  const [mutation, result] = useMutation(CHANGE_EMAIL, {
    onError: (error) => {
      showError(`Changing e-mail failed: ${parseError(error)}!`)
      logger.error('Change e-mail error:', error)
    },
    onCompleted: (data) => {
      dispatch(setMessage('E-mail changed'))
      logger.info('Change e-mail completed:', data)
    },
  })

  const changeEmail = async (password, newEmail) => {
    const changeResult = await mutation({
      variables: {
        password,
        newEmail,
      },
    })

    console.log('change email result:', changeResult)
    if (changeResult.errors) return

    const texterStorage = JSON.parse(localStorage.getItem('texter-login'))
    texterStorage.email = newEmail
    localStorage.setItem('texter-login', JSON.stringify(texterStorage))
    dispatch(setEmail(newEmail))

    logger.info('change email result:', changeResult)
    return changeResult.data?.changeEmail
  }

  return [changeEmail, result]
}

export default useChangeEmail
