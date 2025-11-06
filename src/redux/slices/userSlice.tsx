import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    id: null,
    name: null,
    email: null,
    token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            return { ...state, ...action.payload };
        },
        logout(state) {
            return { ...initialState };
        },
        updateUser(state, action) {
            return { ...state, ...action.payload };
        }
    }

})

export const { setUser, logout, updateUser } = userSlice.actions
export default userSlice.reducer;