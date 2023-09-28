import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import errorReducer from './errorSlice'
import selectionReducer from './selectionSlice'


const reducer = {
  user: userReducer,
  //input: inputReducer,
  error: errorReducer,
  //confirm: confirmReducer,
  selection: selectionReducer
}

export default configureStore({
  reducer
})