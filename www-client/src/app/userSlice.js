import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  id: '',
  name: '',
  username: '',
  ownedGroups: [],
  joinedGroups: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userData: emptyUser
  },
  reducers: {
    logIn: (state, action) => {
      console.log('Login action payload:', action.payload)
      state.token = action.payload.token
      state.userData = action.payload.user
    },
    logOut: state => {
      state.token = null
      state.userData = emptyUser
    },
    addOwnedGroup: (state, action) => {
      state.userData.ownedGroups.push(action.payload)
    },
    addJoinedGroup: (state, action) => {
      state.userData.joinedGroups.push(action.payload)
    }
  }
})

export const { logIn, logOut, addOwnedGroup, addJoinedGroup } = userSlice.actions
export default userSlice.reducer