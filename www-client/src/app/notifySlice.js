import { createSlice } from '@reduxjs/toolkit'

export const notifySlice = createSlice({
  name: 'notify',
  initialState: {
    message: '',
    severity: 'success',
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload
    },
    setClearMessage: (state) => {
      state.message = ''
    },
  },
})

export const { setMessage, setClearMessage } = notifySlice.actions
export default notifySlice.reducer
