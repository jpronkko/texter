import { useDispatch } from 'react-redux'

import { setMessage, setClearMessage } from '../../app/notifySlice'

const useNotifyMessage = () => {
  const dispatch = useDispatch()

  const showMessage = (message) => {
    dispatch(setMessage(message))
  }

  const clearMessage = () => {
    dispatch(setClearMessage())
  }

  return [showMessage, clearMessage]
}

export default useNotifyMessage
