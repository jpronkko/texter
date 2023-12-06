import { useDispatch } from 'react-redux'

import { setError, clearError as setErrorNone } from '../../app/errorSlice'

const useError = () => {
  const dispatch = useDispatch()

  const showError = (message) => {
    console.log('Setting error', message)
    dispatch(setError(message))
  }

  const clearError = () => {
    dispatch(setErrorNone())
  }

  return [showError, clearError]
}

export default useError
