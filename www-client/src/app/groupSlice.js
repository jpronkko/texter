import { createSlice } from '@reduxjs/toolkit'

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    id: '',
    name: '',
    messages: [],
  },
  reducers: {
    setGroup: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.id = action.payload.id
      state.name = action.payload.name
      state.messages = action.payload.messages ? action.payload.messages : []
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action) => {
      console.log('Setting groups messages!!!', action.payload)
      state.messages = action.payload
      console.log('msg', state.messages)
    },
    clearGroup: (state) => {
      state.id = ''
      state.name = ''
      state.messages = []
    }
  }
})

export const { setGroup, addMessage, setMessages } = groupSlice.actions
export default groupSlice.reducer