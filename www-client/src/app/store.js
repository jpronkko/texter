import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

const reducer = {
  user: userReducer
}
export default configureStore({
  reducer
})