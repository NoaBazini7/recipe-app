import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        background: {
            default: "#2B3349",
            paper: "#F8F7FF",
        },
        primary: {
            main: "#EFE9D3",
            lighter: "#f1f0e9",
            contrastText: "#F8F7FF",
        },
        secondary: {
            main: "#223C63",
        },
        text: {
            primary: "#8F4E51",
            secondary: "#F6724B",
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700,
        body1: {
            fontWeight: 400,
            fontSize: "1.2rem",
        },
        h2: {
            fontWeight: 700,
            fontSize: 35,
            color: "#F6724B",

        },
        h3: {
            fontWeight: 700,
            fontSize: 35,
        },
        h4: {
            fontWeight: 700,
            fontSize: 40,
        },
        button: {
            textTransform: "none", // keep button text normal-case
        },
    },
    shape: {
        borderRadius: 15,
    },

    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "white",
                    borderRadius: 17,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FC8A55',
                        borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1565c0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8F4E51',
                    },
                },
                input: {
                    padding: "13px",

                },
            },
        },


        MuiButton: {    //color of buttons
            styleOverrides: {
                root: {
                    borderRadius: 9,
                    padding: "10px 20px",
                    fontSize: "1rem",
                    width: "150px",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "#8F4E51",
                    border: "2px solid",
                    "&:hover": {
                        backgroundColor: "#FC8A55",
                        borderColor: "#8F4E51 ",
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    flex: 1,
                    minWidth: 200,
                    padding: 16,
                    borderRadius: 24,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#e3f2fd", // default hover (light blue, adjust as needed)
                    },
                    "&.Mui-selected": {
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        color: "#fff",
                        backgroundColor: "#223C63",
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "#173155", // primary.dark
                    },
                },
            },
        },
    },


});

export default theme;