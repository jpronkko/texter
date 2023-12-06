import { useDispatch } from 'react-redux'

import { setMessage, setClearMessage } from '../../app/notifySlice'

const useNotifyMessage = () => {
  const dispatch = useDispatch()

  const showMessage = (message) => {
    console.log('Setting notify', message)
    dispatch(setMessage(message))
    /*  setTimeout(() => {
      dispatch(setClearMessage())
    }, 5000) */
  }

  const clearMessage = () => {
    dispatch(setClearMessage())
  }

  return [showMessage, clearMessage]
}

export default useNotifyMessage
