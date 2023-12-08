import { useDispatch } from 'react-redux'

import {
  setMessage,
  clearMessage as setClearMessage,
} from '../../app/confirmSlice'

const useConfirmMessage = () => {
  const dispatch = useDispatch()

  const showMessage = (title, message, targetIds) => {
    console.log('Setting message', message)
    dispatch(setMessage({ title, message, targetIds }))
  }

  const clearMessage = () => {
    dispatch(setClearMessage())
  }

  return [showMessage, clearMessage]
}

export default useConfirmMessage
