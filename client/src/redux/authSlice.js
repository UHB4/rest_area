import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        updateAccessToken(state, action) { // 새로운 액션 추가
            state.accessToken = action.payload.accessToken;
        }
    },
});

export const { loginSuccess, logout, setUser, updateAccessToken } = authSlice.actions; // 새로운 액션을 export
export default authSlice.reducer;
