import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    lingua: "it"
  },

  reducers: {
    setLanguage: (state, action) => {
        state.lingua = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLanguage } = settingsSlice.actions

export default settingsSlice.reducer