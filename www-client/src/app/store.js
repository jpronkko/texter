import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import errorReducer from './errorSlice'
import confirmReducer from './confirmSlice'
import groupReducer from './groupSlice'

const reducer = {
  user: userReducer,
  error: errorReducer,
  confirm: confirmReducer,
  group: groupReducer
}

export default configureStore({
  reducer
})