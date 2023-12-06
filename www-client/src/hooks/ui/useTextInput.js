import { useDispatch } from 'react-redux'

import {
  setQuery,
  clearInput as setClearMessage,
  setInput,
} from '../../app/inputSlice'

const useTextInput = () => {
  const dispatch = useDispatch()
  const showInput = (title) => {
    dispatch(setQuery({ title }))
  }

  const clearInput = () => {
    dispatch(setClearMessage())
  }

  const setTextInput = (text) => {
    dispatch(setInput(text))
  }

  return [showInput, clearInput, setTextInput]
}

export default useTextInput
