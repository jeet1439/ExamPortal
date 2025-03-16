import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user', 
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFaliure: (state, action) =>{
            state.loading = false;
            state.error = action.payload
        },
        updateStart: (state) =>{
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart :( state) =>{
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteuserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess : (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
  }
  });

export const { signInStart, signInSuccess, signInFaliure, updateStart, updateSuccess, updateFailure,
    deleteUserStart, deleteUserSuccess, deleteuserFailure, signoutSuccess
 } = userSlice.actions;
export default userSlice.reducer;