import { createSlice } from '@reduxjs/toolkit'
import { logOut } from './userSlice'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    groupId: '',
    groupName: '',
    topicId: '',
    topicName: '',
  },
  reducers: {
    setGroup: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.groupId = action.payload.id
      state.groupName = action.payload.name
    },
    clearGroup: (state) => {
      state.groupId = ''
      state.groupName = ''
    },
    setTopic: (state, action) => {
      console.log('Group set group action payload:', action.payload)
      state.topicId = action.payload.id
      state.topicName = action.payload.name
    },
    clearTopic: (state) => {
      state.topicId = ''
      state.topicName = ''
    },
  },
  extraReducers(builder) {
    builder.addCase(logOut, (state) => {
      state.groupId = ''
      state.groupName = ''
      state.topicId = ''
      state.topicName = ''
    })
  },
})

export const { setGroup, setTopic, addMessage, setMessages } =
  selectionSlice.actions
export default selectionSlice.reducer
