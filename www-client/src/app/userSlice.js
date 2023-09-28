import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  id: '',
  name: '',
  username: '',
  groups: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userData: emptyUser,
  },
  reducers: {
    logIn: (state, action) => {
      console.log('Login action payload:', action.payload)
      state.token = action.payload.token
      const user = action.payload.user
      state.userData = {
        username: user.username,
        name: user.name,
        email: user.email,
        groups: user.groups ? user.groups : [],
      }
    },
    logOut: (state) => {
      state.token = null
      state.userData = emptyUser
    },
    addJoinedGroup: (state, action) => {
      state.userData.groups.push(action.payload)
    },
  },
})

export const { logIn, logOut, addJoinedGroup } = userSlice.actions
export default userSlice.reducer
