import React from "react";
import ReactDOM from "react-dom/client";
import "styles.css";
import App from "App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "api/redux/store";
import axios from "axios";
import useAxios from "api/axios/useAxios";
import { ThemeProvider } from "@mui/material";
import { theme } from "theme";
import "react-confirm-alert/src/react-confirm-alert.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </PersistGate>
    </Provider>
);
