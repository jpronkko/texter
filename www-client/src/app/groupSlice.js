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
      state.messages = action.payload.messages
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    clearGroup: (state) => {
      state.id = ''
      state.name = ''
      state.messages = []
    }
  }
})

export const { setGroup, addMessage } = groupSlice.actions
export default groupSlice.reducer