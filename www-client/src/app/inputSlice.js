import { createSlice } from '@reduxjs/toolkit'

export const inputSlice = createSlice({
  name: 'input',
  initialState: {
    title: 'rapea',
    inputText: '',
  },
  reducers: {
    setQuery: (state, action) => {
      state.title = action.payload.title
      state.inputText = ''
    },
    clearInput: state => {
      state.title = ''
      state.inputText = ''
    },
    setInput: (state, action) => {
      state.inputText = action.payload
    }
  }
})

export const { setQuery, clearInput, setInput } = inputSlice.actions
export default inputSlice.reducer