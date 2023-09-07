import { createSlice } from '@reduxjs/toolkit'
import { logOut } from './userSlice'
import { clearGroup } from './selectionSlice'

export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      console.log('Setting groups messages!!!', action.payload)
      state.messages = action.payload
      console.log('msg', state.messages)
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    }
  },
  extraReducers(builder) {
    builder.addCase(logOut, (state) => {
      state.id = ''
      state.name = ''
      state.messages = []
    }),
    builder.addCase(clearGroup, (state) => {
      state.id = ''
      state.name = ''
      state.messages = []
    })
  }
})

export const { setGroup, addMessage, setMessages } = messageSlice.actions
export default messageSlice.reducer