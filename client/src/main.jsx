import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme/theme.js";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <App/>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
)
