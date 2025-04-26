import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppBar, Box, Button, IconButton, Toolbar, Typography,} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import "../App.css";
import {useUser} from "../contexts/UserContext.jsx";


const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
};

const UserPage = () => {
    const navigate = useNavigate();
    const [showUsernameInput, setShowUsernameInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {logout} = useUser();

    const handleLogout = () => {
        alert("Logged out!");
        logout();

        navigate("/");
    };

    const handleUpdateUsername = async () => {
        try {
            await axios.post("http://localhost:5000/api/users/update", {
                username,
            });
            alert("Username updated!");
            setUsername("");
            setShowUsernameInput(false);
        } catch (err) {
            console.error("Error updating username:", err);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await axios.post("http://localhost:5000/api/users/update", {
                oldPassword,
                newPassword,
            });
            alert("Password updated!");
            setOldPassword("");
            setNewPassword("");
            setShowPasswordInput(false);
        } catch (err) {
            console.error("Error updating password:", err);
        }
    };

    return (
        <>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate("/profile")}>
                        <HomeIcon/>
                    </IconButton>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        User Settings
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box p={4} maxWidth={500} mx="auto" textAlign="center">
                <Typography variant="h5" mb={3}>Check Your Info</Typography>
                {!showUsernameInput ? (
                    <Button
                        variant="outlined"
                        onClick={() => setShowUsernameInput(true)}
                        sx={{borderColor: '#E43D12', color: '#E43D12', borderRadius: 4, mb: 2}}
                        fullWidth
                    >
                        Change Username
                    </Button>
                ) : (
                    <Box mb={3}>
                        <input
                            style={inputStyle}
                            placeholder="New Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                onClick={handleUpdateUsername}
                                sx={{backgroundColor: "#E43D12", color: "#fff", borderRadius: 4}}
                                fullWidth
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setShowUsernameInput(false)}
                                fullWidth
                                sx={{borderColor: '#E43D12', borderRadius: 4,}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

                {!showPasswordInput ? (
                    <Button
                        variant="outlined"
                        onClick={() => setShowPasswordInput(true)}
                        sx={{borderColor: '#E43D12', borderRadius: 4,}}
                        fullWidth
                    >
                        Change Password
                    </Button>
                ) : (
                    <Box>
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (newPassword !== confirmPassword) {
                                        alert("Passwords do not match.");
                                        return;
                                    }
                                    handleUpdatePassword();
                                }}
                                sx={{backgroundColor: "#E43D12", color: "#fff", borderRadius: 4}}
                                fullWidth
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setShowPasswordInput(false);
                                    setOldPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");

                                }}
                                sx={{borderColor: '#E43D12', color: '#E43D12', borderRadius: 4,}}
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

            </Box>
        </>
    );
};

export default UserPage;
