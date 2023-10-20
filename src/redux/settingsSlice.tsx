import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    routeStack: [{visible:true},{visible:false},{visible:false},{visible:false},{visible:true}],
    lingua: "it",
    percorsiOffline: [],
    ricercaCorrente: "",
    risultatoSingoloMappa: null
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
    setRisultatoSingoloMappa: (state, action) => {
      state.risultatoSingoloMappa = action.payload;
    },
    resetState: (state) => {
        state.routeStack = [{visible:true},{visible:false},{visible:false},{visible:false},{visible:true}],
        state.ricercaCorrente = "";
        state.risultatoSingoloMappa = null
    } 
  }
})

// Action creators are generated for each case reducer function
export const { setLanguage, setPercorsiOffline, setRouteStack, setRicercaCorrente, addRouteStack, resetState, setRisultatoSingoloMappa } = settingsSlice.actions

export default settingsSlice.reducer