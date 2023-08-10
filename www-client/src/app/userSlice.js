import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    token: null,
    groups: [],
  },
  reducers: {
    logIn: (state, action) => {
      console.log('action payload:', action.payload)
      state.username = action.payload.username
      state.token = action.payload.token
      state.groups = action.payload.groups
    },
    logOut: state => {
      state.username = ''
      state.token = null
      state.groups = []
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload.id)
    }
  }
})

export const { logIn, logOut, addGroup } = userSlice.actions
export default userSlice.reducer