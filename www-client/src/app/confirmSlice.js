import { createSlice } from '@reduxjs/toolkit'

export const confirmSlice = createSlice({
  name: 'confirm',
  initialState: {
    title: 'rapea',
    message: '321',
    targetIds: [],
  },
  reducers: {
    setMessage: (state, action) => {
      state.title = action.payload.title
      state.message = action.payload.message
      state.targetIds = action.payload.targetIds
      console.log(state.confirm)
    },
    clearMessage: (state) => {
      state.title = ''
      state.message = ''
      state.targetIds = []
    },
  },
})

export const { setMessage, clearMessage } = confirmSlice.actions
export default confirmSlice.reducer
