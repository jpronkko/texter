import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import inputReducer from './inputSlice'
import errorReducer from './errorSlice'
import confirmReducer from './confirmSlice'
import groupReducer from './groupSlice'

const reducer = {
  user: userReducer,
  input: inputReducer,
  error: errorReducer,
  confirm: confirmReducer,
  group: groupReducer
}

export default configureStore({
  reducer
})