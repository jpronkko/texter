import { createSlice } from '@reduxjs/toolkit'

export const confirmSlice = createSlice({
  name: 'confirm',
  initialState: {
    title: 'rapea',
    message: '321',
    callback: null
  },
  reducers: {
    setMessage: (state, action) => {
      state.title = action.payload.title
      state.message = action.payload.message
      state.callback = action.payload.callback
      console.log(state.confirm)
    },
    clearMessage: state => {
      state.title = ''
      state.message = ''
      state.callback = null
    }
  }
})

export const { setMessage, clearMessage } = confirmSlice.actions
export default confirmSlice.reducer