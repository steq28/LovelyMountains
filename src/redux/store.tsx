import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'

export default configureStore({
  reducer: {
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})