import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  id: '',
  name: '',
  username: '',
  ownedGroups: [],
  joinedGroups: [],
}

export const userSlice = createSlice({
  name: 'userAndToken',
  initialState: {
    token: null,
    user: emptyUser
  },
  reducers: {
    logIn: (state, action) => {
      console.log('action payload:', action.payload)
      state.user = action.payload
    },
    logOut: state => {
      state.token = null
      state.user = emptyUser
    },
    addOwnedGroup: (state, action) => {
      state.user.ownedGroups.push(action.payload.id)
    },
    addJoinedGroup: (state, action) => {
      state.user.joinedGroups.push(action.payload.id)
    }
  }
})

export const { logIn, logOut, addOwnedGroup, addJoinedGroup } = userSlice.actions
export default userSlice.reducer