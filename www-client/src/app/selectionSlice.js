import { createSlice } from '@reduxjs/toolkit'
import { logOut } from './userSlice'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    group: { id: '', name: '' },
    topic: { id: '', name: '' },
  },
  reducers: {
    setGroup: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.group = { id: action.payload.id, name: action.payload.name }
      state.topic = { id: '', name: '' }
    },
    clearGroup: (state) => {
      state.group = { id: '', name: '' }
      state.topic = { id: '', name: '' }
    },
    setTopic: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.topic = { id: action.payload.id, name: action.payload.name }
    },
    clearTopic: (state) => {
      state.topic = { id: '', name: '' }
    },
  },
  extraReducers(builder) {
    builder.addCase(logOut, (state) => {
      state.group = { id: '', name: '' }
      state.topic = { id: '', name: '' }
    })
  },
})

export const {
  clearGroup,
  setGroup,
  clearTopic,
  setTopic,
  addMessage,
  setMessages,
} = selectionSlice.actions
export default selectionSlice.reducer
