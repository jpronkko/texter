import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  id: '',
  name: '',
  username: '',
  email: '',
  //groups: [],
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

      state.userData = {
        id: action.payload.userId,
        email: action.payload.email,
        name: action.payload.name,
        username: action.payload.username,
        //groups: [],
      }
    },
    logOut: (state) => {
      state.token = null
      state.userData = emptyUser
    },
    /*setGroups: (state, action) => {

    }
    addJoinedGroup: (state, action) => {
      state.userData.groups.push(action.payload)
    },*/
  },
})

export const { logIn, logOut /*addJoinedGroup*/ } = userSlice.actions
export default userSlice.reducer
