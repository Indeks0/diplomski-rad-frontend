import { configureStore } from "@reduxjs/toolkit";
import authReducer from "api/redux/authSlice";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    middleware: [thunk],
});

const persistor = persistStore(store);

export { store, persistor };
