import {useState} from "react";
import {useUser} from "../contexts/UserContext.jsx";
import {Alert, Box, Button, Stack, TextField, Typography,} from "@mui/material";
import axios from "axios";

export default function EditUserForm({onUpdate}) {
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: user ? user.email : "",
        password: "", // Leave empty unless they want to change
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            formData.username = user.username; // Include username in the request
            const {data} = await axios.put(`http://localhost:5000/api/users/update`, formData);
            setSuccess("User info updated successfully!");
            onUpdate?.(data); // Notify parent if needed
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            maxWidth: 400, mx: "auto", mt: 4,
            display: "flex", flexDirection: "column", gap: 2, justifyContent: "center",
        }}>
            <Typography variant="h5" gutterBottom>
                Edit Profile
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                />

                <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    helperText="Leave blank to keep current password"
                />

                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Button type="submit" variant="contained" disabled={loading} sx={
                        {width: "70%"}
                    }>
                        {loading ? "Updating..." : "Save Changes"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
