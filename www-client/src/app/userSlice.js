import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    token: null,
    ownedGroups: [],
    joinedGroups: [],
  },
  reducers: {
    logIn: (state, action) => {
      console.log('action payload:', action.payload)
      state.username = action.payload.username
      state.token = action.payload.token
      state.ownedGroups = action.payload.ownedGroups
      state.joinedGroups = action.payload.joinedGroups
    },
    logOut: state => {
      state.username = ''
      state.token = null
      state.ownedGroups = []
      state.joinedGroups = []
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload.id)
    }
  }
})

export const { logIn, logOut, addGroup } = userSlice.actions
export default userSlice.reducer