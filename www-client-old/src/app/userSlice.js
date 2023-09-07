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
      const user = action.payload.user
      state.userData = {
        username: user.username,
        name: user.name,
        email: user.email,
        ownedGroups: user.ownedGroups ? user.ownedGroups : [],
        joinedGroups: user.joinedGroups ? user.joinedGroups: [],
      }
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