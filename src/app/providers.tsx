"use client";

import { persistor, store } from "@/lib/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { FavoritesProvider } from "@/context/favorites";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster richColors position="top-center" />
                <FavoritesProvider>
                    {children}
                </FavoritesProvider>
            </PersistGate>
        </Provider>
    );
}
