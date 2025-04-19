import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        background: {
            default: "#F6F4E6", // Your light neutral
            paper: "#F3EAD6",   // Your warm neutral
        },
        primary: {
            main: "#F3EAD6",     // Your warm neutral
            contrastText: "#A66D45", // Your warm accent
        },
        secondary: {
            main: "#F6B6A7",
        },
        text: {
            primary: "#975d2a",
            secondary: "#FD9584",
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif", // or whatever you like
        button: {
            textTransform: "none", // keep button text normal-case
        },
    },
    shape: {
        borderRadius: 12, // global roundness 💫
    },

    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {  // color of text fields
            styleOverrides: {
                root: {
                    backgroundColor: "white",
                    borderRadius: 12,
                },
                input: {
                    padding: "10px",
                },
            },
        },
        MuiButton: {    //color of buttons
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: "#FD9584",
                    color: "#F3EAD6",
                    "&:hover": {
                        backgroundColor: "#975d2a",
                    },
                },
            },
        },
    },


});

export default theme;