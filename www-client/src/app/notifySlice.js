import { createSlice } from '@reduxjs/toolkit'

export const notifySlice = createSlice({
  name: 'notify',
  initialState: {
    message: '',
    severity: 'success',
  },
  reducers: {
    setMessage: (state, action) => {
      console.log('Action payload', action.payload)
      state.message = action.payload
    },
    setClearMessage: (state) => {
      state.message = ''
    },
  },
})

export const { setMessage, setClearMessage } = notifySlice.actions
export default notifySlice.reducer
