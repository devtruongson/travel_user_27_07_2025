import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage cho web

// Cấu hình persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // reducer nào muốn lưu
};

const rootReducer = combineReducers({
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Persistor dùng để khởi động persist
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
