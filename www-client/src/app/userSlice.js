import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    hasLoggedIn: false
  },
  reducers: {
    logIn: state => {
      state.hasLoggedIn = true
    },
    logOut: state => {
      state.hasLoggedIn = false
    }
  }
})

export const { logIn, logOut } = userSlice.actions
export default userSlice.reducer