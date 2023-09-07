import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import inputReducer from './inputSlice'
import errorReducer from './errorSlice'
import confirmReducer from './confirmSlice'
import selectionReducer from './selectionSlice'


const reducer = {
  user: userReducer,
  input: inputReducer,
  error: errorReducer,
  confirm: confirmReducer,
  selection: selectionReducer
}

export default configureStore({
  reducer
})