import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    routeStack: [{},{},{},{},{}],
    lingua: "it",
    percorsiOffline: [],
    ricercaCorrente: "",
  },

  reducers: {
    setLanguage: (state, action) => {
        state.lingua = action.payload;
    },
    setRouteStack: (state, action) => {
        state.routeStack = action.payload;
    },
    addRouteStack: (state, action) => {
        state.routeStack[action.payload.index] = action.payload.value;
    },
    setPercorsiOffline: (state, action) => {
        state.percorsiOffline = action.payload;
    },
    setRicercaCorrente: (state, action) => {
        state.ricercaCorrente = action.payload;
    },
    resetState: (state) => {
        state.routeStack = [{},{},{},{},{}];
        state.ricercaCorrente = "";
    } 
  }
})

// Action creators are generated for each case reducer function
export const { setLanguage, setPercorsiOffline, setRouteStack, setRicercaCorrente, addRouteStack, resetState } = settingsSlice.actions

export default settingsSlice.reducer