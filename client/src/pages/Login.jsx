import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Axios from "axios";
import {Box, Button, TextField, Typography} from "@mui/material";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios.post("http://localhost:5000/api/auth/login", {
                username,
                password
            });

            if (response.data.success) {
                navigate("/profile");
            } else {
                setErrorMessage(response.data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("Login failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                backdropFilter: "blur(70px)",
                backgroundColor: "background.paper", // just to give a lil frost look
                maxWidth: 400,
                mx: "auto",
                mt: 10,
                p: 4,
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h4" color="text.primary">
                Login
            </Typography>
            {errorMessage && (
                <Typography color="error" variant="body2">
                    {errorMessage}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{mb: 2}}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{mb: 2}}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign in
                </Button>
            </form>
            <Typography variant="body2" color="text.secondary">
                No account? <Link to="/register" style={{color: "text.primary", textDecoration: "none"}}>Register</Link>
            </Typography>
        </Box>
    );
};

export default Login;
