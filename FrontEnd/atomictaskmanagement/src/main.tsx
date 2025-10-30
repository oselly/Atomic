import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#2E8BFF" },
        background: {
            default: "#0A0F1C",
            paper: "#0B1224",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#C7C9D1",
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', sans-serif",
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);