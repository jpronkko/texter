import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  id: '',
  name: '',
  username: '',
  email: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userData: emptyUser,
  },
  reducers: {
    logIn: (state, action) => {
      state.token = action.payload.token

      state.userData = {
        id: action.payload.userId,
        email: action.payload.email,
        name: action.payload.name,
        username: action.payload.username,
      }
    },
    logOut: (state) => {
      state.token = null
      state.userData = emptyUser
    },
    setEmail: (state, action) => {
      state.userData.email = action.payload
    },
    setPassword: (state, action) => {
      state.userData.password = action.payload
    },
  },
})

export const { logIn, logOut, setEmail, setPassword } = userSlice.actions
export default userSlice.reducer
