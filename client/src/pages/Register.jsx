import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Axios from "axios";
import {Alert, Box, Button, Paper, TextField, Typography} from "@mui/material";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await Axios.post("http://localhost:5000/api/register", {
                email,
                password,
            });

            if (response.data.success) {
                navigate("/profile");
            } else {
                setErrorMessage(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    border: "4px solid",
                    borderColor: "text.primary",
                    maxWidth: 800,
                    width: "100%",
                    backgroundColor: "background.paper",
                    boxShadow: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    Register
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 3,
                        }}
                    >
                        Submit
                    </Button>
                </form>

                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }} textAlign="center">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "text.primary", textDecoration: "underline" }}>
                        Log in
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Register;
