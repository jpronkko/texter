import { createSlice } from '@reduxjs/toolkit'
import { logOut } from './userSlice'

const emptyGroup = { id: '', name: '', description: '' }
const emptyTopic = { id: '', name: '', groupId: '' }

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    group: emptyGroup,
    topic: emptyTopic,
  },
  reducers: {
    setGroup: (state, action) => {
      console.log('Set group action payload:', action.payload)
      state.group = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
      }
      state.topic = emptyTopic
    },
    clearGroup: (state) => {
      state.group = emptyGroup
      state.topic = emptyTopic
    },
    setTopic: (state, action) => {
      console.log('Set topic  action payload:', action.payload)
      state.topic = {
        id: action.payload.id,
        name: action.payload.name,
        groupId: action.payload.groupId,
      }
    },
    clearTopic: (state) => {
      state.topic = emptyTopic
    },
  },
  extraReducers(builder) {
    builder.addCase(logOut, (state) => {
      state.group = emptyGroup
      state.topic = emptyTopic
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
