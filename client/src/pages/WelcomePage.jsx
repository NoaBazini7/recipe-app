import {Box, Button, Typography} from "@mui/material";
import GifBackground from "../components/GifBack.jsx";
import {useNavigate} from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();


    function handleLogIn() {
        navigate("/login");
    }

    function handleRegister() {
        navigate("/register");
    }

    return (
        <>
            <GifBackground/>
            <Box
                sx={{
                    backdropFilter: "blur(70px)",
                    maxWidth: "70%",
                    position: "absolute",
                    alignItems: "center",
                    top: "50%", // Center vertically
                    left: "50%", // Center horizontally
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "15px",
                    padding: "40px 20px",
                    borderRadius: "60px",
                    zIndex: 1000,
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" sx={{maxWidth: "90%", color:"primary.contrastText", marginTop:"20px", textShadow:"2px black"}}>
                    Welcome to your cooking assistant!
                </Typography>
                <Typography variant="body1" sx={{maxWidth: "90%", color:"primary.contrastText", marginBottom:"40px", textShadow:"2px black"}}>
                    Pick your ingredients — we’ll find what to cook.                </Typography>
                <Button variant="contained"
                        sx={{fontSize: "1rem", borderRadius: "20px", width: "150px"}}
                        onClick={handleLogIn}>
                    Log in
                </Button>
                <Button variant="contained"
                        sx={{fontSize: "1rem", borderRadius: "20px", width: "150px"}}
                        onClick={handleRegister}>
                    Register
                </Button>
            </Box>
        </>
    );
}

export default WelcomePage;
