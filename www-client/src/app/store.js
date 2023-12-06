import { configureStore } from '@reduxjs/toolkit'

import errorReducer from './errorSlice'
import notifyReducer from './notifySlice'
import selectionReducer from './selectionSlice'
import userReducer from './userSlice'

const reducer = {
  error: errorReducer,
  notify: notifyReducer,
  selection: selectionReducer,
  user: userReducer,
}

export default configureStore({
  reducer,
})
