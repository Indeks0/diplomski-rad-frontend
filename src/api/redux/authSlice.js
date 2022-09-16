import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        email: null,
        token: null,
        refreshToken: null,
        expiration: null,
        role: null,
        name: null,
        surname: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const {
                email,
                token,
                refreshToken,
                expiration,
                role,
                name,
                surname,
            } = action.payload;
            state.email = email;
            state.token = token;
            state.refreshToken = refreshToken;
            state.expiration = expiration;
            state.role = role;
            state.name = name;
            state.surname = surname;
        },
        setTokens: (state, action) => {
            const { token, refreshToken, expiration } = action.payload;
            state.token = token;
            state.refreshToken = refreshToken;
            state.expiration = expiration;
        },
        logOut: (state) => {
            state.email = null;
            state.token = null;
            state.refreshToken = null;
            state.expiration = null;
            state.role = null;
            state.name = null;
            state.surname = null;
        },
    },
});

export const { setCredentials, logOut, setTokens } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state) => state.auth;

export const getToken = (response) => {
    return function (dispatch, getState) {
        dispatch(setTokens({ ...response.data }));
    };
};
