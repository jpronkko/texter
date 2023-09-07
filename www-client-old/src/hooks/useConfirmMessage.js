import { setMessage, clearMessage as setClearMessage } from '../app/confirmSlice'
import { useDispatch } from 'react-redux'

const useConfirmMessage = () => {
  const dispatch = useDispatch()

  const showMessage = (title, message, callback) => {
    console.log('Setting message', message)
    dispatch(setMessage({ title, message, callback }))
  }

  const clearMessage = () => {
    dispatch(setClearMessage())
  }

  return [showMessage, clearMessage]
}

export default useConfirmMessage