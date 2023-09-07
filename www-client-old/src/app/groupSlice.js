import { createSlice } from '@reduxjs/toolkit'
import { logOut } from './userSlice'

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    id: '',
    name: '',
  },
  reducers: {
    setGroup: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.id = action.payload.id
      state.name = action.payload.name
      state.messages = action.payload.messages ? action.payload.messages : []
    },
    clearGroup: (state) => {
      state.id = ''
      state.name = ''
    }
  },
  extraReducers(builder) {
    builder.addCase(logOut, (state) => {
      state.id = ''
      state.name = ''
    })
  }
})

export const { setGroup, addMessage, setMessages } = groupSlice.actions
export default groupSlice.reducer