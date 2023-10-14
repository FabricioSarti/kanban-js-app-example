import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: {} }

//da un bug al no tener void() se arreglo segun 
//https://stackoverflow.com/questions/60806105/error-an-immer-producer-returned-a-new-value-and-modified-its-draft-either-r

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => void(state.value = action.payload)
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer