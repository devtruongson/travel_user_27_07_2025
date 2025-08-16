import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    is_verified: boolean;
    avatar: string;
    avatar_url: string;
    created_at: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        updateUserAvatar: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.avatar_url = action.payload;
            }
        },
    },
});

export const { setAuth, clearAuth, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
