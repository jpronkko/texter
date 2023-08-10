import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import errorReducer from './errorSlice'

const reducer = {
  user: userReducer,
  error: errorReducer,
}

export default configureStore({
  reducer
})