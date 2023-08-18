import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: '123',
  },
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message
    },
    clearError: state => {
      state.message = ''
    }
  }
})

export const { setError, clearError } = errorSlice.actions
export default errorSlice.reducer